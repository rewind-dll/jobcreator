-- Check if player is admin
local function IsPlayerAdmin(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    if not xPlayer then return false end
    
    -- Get all player identifiers
    local playerIdentifiers = GetPlayerIdentifiers(source)
    
    -- Check identifier-based access (check ALL identifiers)
    for _, configIdentifier in ipairs(Config.AdminAccess.identifiers) do
        for _, playerIdentifier in ipairs(playerIdentifiers) do
            if playerIdentifier == configIdentifier then
                return true
            end
        end
    end
    
    -- Check group-based access
    for _, group in ipairs(Config.AdminAccess.groups) do
        if xPlayer.getGroup() == group then
            return true
        end
    end
    
    return false
end

-- Get admin status for client
ESX.RegisterServerCallback('jobcreator:getAdminStatus', function(src, cb)
    cb(IsPlayerAdmin(src))
end)

-- Create new job with grades
RegisterNetEvent('jobcreator:server:createJob', function(jobData)
    local src = source
    
    print('[Job Creator] Create job request from player ' .. src)
    
    -- Validate admin permission
    if not IsPlayerAdmin(src) then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if Config.Notifications.useOxLib then
                xPlayer.triggerEvent('ox_lib:notify', {
                    type = 'error',
                    description = 'You do not have permission to create jobs'
                })
            else
                xPlayer.showNotification('You do not have permission to create jobs', 'error')
            end
        end
        return
    end
    
    -- Validate input data
    if not jobData or not jobData.name or not jobData.label or not jobData.grades or #jobData.grades == 0 then
        print('[Job Creator] Invalid job data provided')
        TriggerClientEvent('jobcreator:client:creationResult', src, false, 'Invalid job data provided')
        return
    end
    
    print('[Job Creator] Creating job: ' .. jobData.name .. ' with ' .. #jobData.grades .. ' grades')
    
    -- Check for duplicate job name
    local existingJob = exports.oxmysql:executeSync('SELECT name FROM jobs WHERE name = ?', { jobData.name })
    if existingJob and #existingJob > 0 then
        print('[Job Creator] Job name already exists: ' .. jobData.name)
        TriggerClientEvent('jobcreator:client:creationResult', src, false, 'Job name already exists in database')
        return
    end
    
    -- Insert job into database
    local jobInserted = exports.oxmysql:executeSync([[
        INSERT INTO jobs (name, label, whitelisted) 
        VALUES (?, ?, ?)
    ]], {
        jobData.name,
        jobData.label,
        Config.JobDefaults.whitelisted and 1 or 0
    })
    
    if not jobInserted then
        print('[Job Creator] Failed to insert job')
        TriggerClientEvent('jobcreator:client:creationResult', src, false, 'Failed to insert job into database')
        return
    end
    
    print('[Job Creator] Job inserted, now inserting grades...')
    
    -- Insert all job grades
    local gradesInserted = 0
    for i, grade in ipairs(jobData.grades) do
        print('[Job Creator] Inserting grade ' .. i .. ': ' .. grade.name)
        local gradeInserted = exports.oxmysql:executeSync([[
            INSERT INTO job_grades (job_name, grade, name, label, salary, skin_male, skin_female)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ]], {
            jobData.name,
            grade.grade,
            grade.name,
            grade.label,
            grade.salary,
            '{}',
            '{}'
        })
        
        if gradeInserted then
            gradesInserted = gradesInserted + 1
        end
    end
    
    if gradesInserted ~= #jobData.grades then
        print('[Job Creator] Some grades failed to insert: ' .. gradesInserted .. '/' .. #jobData.grades)
        TriggerClientEvent('jobcreator:client:creationResult', src, false, 'Some grades failed to insert')
        return
    end
    
    print('[Job Creator] All grades inserted successfully')
    
    -- Refresh ESX jobs if enabled
    if Config.JobDefaults.autoRefresh then
        print('[Job Creator] Refreshing ESX jobs...')
        ESX.RefreshJobs()
    end
    
    -- Log the creation
    print(('[Job Creator] %s created job "%s" with %d grades'):format(
        GetPlayerName(src),
        jobData.name,
        gradesInserted
    ))
    
    -- Send success response
    TriggerClientEvent('jobcreator:client:creationResult', src, true, ('Job "%s" created successfully with %d grades'):format(jobData.label, gradesInserted))
end)

-- Get all existing jobs with grades
ESX.RegisterServerCallback('jobcreator:getAllJobs', function(src, cb)
    print('[Job Creator] getAllJobs called by player ' .. src)
    
    if not IsPlayerAdmin(src) then
        print('[Job Creator] Player ' .. src .. ' is not admin')
        cb({})
        return
    end
    
    print('[Job Creator] Player ' .. src .. ' is admin, fetching jobs...')
    
    -- Fetch all jobs using exports
    local jobs = exports.oxmysql:executeSync('SELECT name, label, whitelisted FROM jobs ORDER BY name ASC')
    
    print('[Job Creator] Query returned: ' .. type(jobs))
    if jobs then
        print('[Job Creator] Found ' .. #jobs .. ' jobs')
    end
    
    if not jobs or #jobs == 0 then
        print('[Job Creator] No jobs returned from query')
        cb({})
        return
    end
    
    -- Fetch ALL grades in a single query using exports
    print('[Job Creator] Fetching all job grades...')
    local allGrades = exports.oxmysql:executeSync('SELECT id, job_name, grade, name, label, salary FROM job_grades ORDER BY job_name, grade ASC')
    print('[Job Creator] Fetched ' .. (allGrades and #allGrades or 0) .. ' total grades')
    
    -- Group grades by job name
    local gradesByJob = {}
    if allGrades then
        for _, grade in ipairs(allGrades) do
            if not gradesByJob[grade.job_name] then
                gradesByJob[grade.job_name] = {}
            end
            table.insert(gradesByJob[grade.job_name], grade)
        end
    end
    
    -- Build final result
    local jobsWithGrades = {}
    for i, job in ipairs(jobs) do
        local jobGrades = gradesByJob[job.name] or {}
        print('[Job Creator] Job "' .. job.name .. '" has ' .. #jobGrades .. ' grades')
        
        table.insert(jobsWithGrades, {
            name = job.name,
            label = job.label,
            whitelisted = job.whitelisted == 1 or job.whitelisted == true,
            grades = jobGrades
        })
    end
    
    print('[Job Creator] Finished processing all jobs. Sending ' .. #jobsWithGrades .. ' jobs to client')
    cb(jobsWithGrades)
    print('[Job Creator] Callback sent')
end)

-- Update existing job grades
RegisterNetEvent('jobcreator:server:updateJob', function(jobData)
    local src = source
    
    print('[Job Creator] Update job request from player ' .. src)
    
    -- Validate admin permission
    if not IsPlayerAdmin(src) then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if Config.Notifications.useOxLib then
                xPlayer.triggerEvent('ox_lib:notify', {
                    type = 'error',
                    description = 'You do not have permission to update jobs'
                })
            else
                xPlayer.showNotification('You do not have permission to update jobs', 'error')
            end
        end
        return
    end
    
    -- Validate input data
    if not jobData or not jobData.name or not jobData.label or not jobData.grades or #jobData.grades == 0 then
        print('[Job Creator] Invalid job data provided for update')
        TriggerClientEvent('jobcreator:client:updateResult', src, false, 'Invalid job data provided')
        return
    end
    
    print('[Job Creator] Updating job: ' .. jobData.name)
    
    -- Update job label
    local jobUpdated = exports.oxmysql:executeSync('UPDATE jobs SET label = ? WHERE name = ?', {
        jobData.label,
        jobData.name
    })
    
    if not jobUpdated then
        print('[Job Creator] Failed to update job label')
        TriggerClientEvent('jobcreator:client:updateResult', src, false, 'Failed to update job')
        return
    end
    
    -- Delete existing grades
    print('[Job Creator] Deleting existing grades for: ' .. jobData.name)
    exports.oxmysql:executeSync('DELETE FROM job_grades WHERE job_name = ?', { jobData.name })
    
    -- Insert updated grades
    local gradesInserted = 0
    for i, grade in ipairs(jobData.grades) do
        print('[Job Creator] Inserting updated grade ' .. i .. ': ' .. grade.name)
        local gradeInserted = exports.oxmysql:executeSync([[
            INSERT INTO job_grades (job_name, grade, name, label, salary, skin_male, skin_female)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ]], {
            jobData.name,
            grade.grade,
            grade.name,
            grade.label,
            grade.salary,
            '{}',
            '{}'
        })
        
        if gradeInserted then
            gradesInserted = gradesInserted + 1
        end
    end
    
    if gradesInserted ~= #jobData.grades then
        print('[Job Creator] Some grades failed to update: ' .. gradesInserted .. '/' .. #jobData.grades)
        TriggerClientEvent('jobcreator:client:updateResult', src, false, 'Some grades failed to update')
        return
    end
    
    print('[Job Creator] All grades updated successfully')
    
    -- Refresh ESX jobs if enabled
    if Config.JobDefaults.autoRefresh then
        print('[Job Creator] Refreshing ESX jobs...')
        ESX.RefreshJobs()
    end
    
    -- Log the update
    print(('[Job Creator] %s updated job "%s" with %d grades'):format(
        GetPlayerName(src),
        jobData.name,
        gradesInserted
    ))
    
    -- Send success response
    TriggerClientEvent('jobcreator:client:updateResult', src, true, ('Job "%s" updated successfully'):format(jobData.label))
end)

-- Delete job completely
RegisterNetEvent('jobcreator:server:deleteJob', function(jobName)
    local src = source
    
    print('[Job Creator] Delete job request from player ' .. src .. ' for job: ' .. jobName)
    
    -- Validate admin permission
    if not IsPlayerAdmin(src) then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if Config.Notifications.useOxLib then
                xPlayer.triggerEvent('ox_lib:notify', {
                    type = 'error',
                    description = 'You do not have permission to delete jobs'
                })
            else
                xPlayer.showNotification('You do not have permission to delete jobs', 'error')
            end
        end
        return
    end
    
    -- Validate input
    if not jobName or jobName == '' then
        print('[Job Creator] Invalid job name for deletion')
        TriggerClientEvent('jobcreator:client:deleteResult', src, false, 'Invalid job name')
        return
    end
    
    -- Delete all job grades first
    print('[Job Creator] Deleting grades for job: ' .. jobName)
    exports.oxmysql:executeSync('DELETE FROM job_grades WHERE job_name = ?', { jobName })
    
    -- Delete the job
    print('[Job Creator] Deleting job: ' .. jobName)
    local deleted = exports.oxmysql:executeSync('DELETE FROM jobs WHERE name = ?', { jobName })
    
    if not deleted then
        print('[Job Creator] Failed to delete job')
        TriggerClientEvent('jobcreator:client:deleteResult', src, false, 'Failed to delete job')
        return
    end
    
    print('[Job Creator] Job deleted successfully')
    
    -- Refresh ESX jobs if enabled
    if Config.JobDefaults.autoRefresh then
        print('[Job Creator] Refreshing ESX jobs...')
        ESX.RefreshJobs()
    end
    
    -- Log the deletion
    print(('[Job Creator] %s deleted job "%s"'):format(GetPlayerName(src), jobName))
    
    -- Send success response
    TriggerClientEvent('jobcreator:client:deleteResult', src, true, 'Job deleted successfully')
end)
