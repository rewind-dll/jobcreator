-- Register admin command
RegisterCommand(Config.Command.name, function()
    -- Check if player is admin
    ESX.TriggerServerCallback('jobcreator:getAdminStatus', function(isAdmin)
        if isAdmin then
            NUI.Open({})
        else
            if Config.Notifications.useOxLib then
                lib.notify({
                    type = 'error',
                    description = 'You do not have permission to access the job creator'
                })
            else
                ESX.ShowNotification('You do not have permission to access the job creator', 'error')
            end
        end
    end)
end, false)

-- Handle job creation from UI
RegisterNuiCallback('createJob', function(data, cb)
    TriggerServerEvent('jobcreator:server:createJob', data)
    cb({ success = true })
end)

-- Receive creation result from server
RegisterNetEvent('jobcreator:client:creationResult', function(success, message)
    if success then
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'success',
                description = message
            })
        else
            ESX.ShowNotification(message, 'success')
        end
        
        -- Close UI on success
        NUI.Close()
    else
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'error',
                description = message
            })
        else
            ESX.ShowNotification(message, 'error')
        end
    end
end)

-- Get all jobs with grades
RegisterNuiCallback('getAllJobs', function(data, cb)
    print('[Job Creator Client] getAllJobs NUI callback triggered')
    ESX.TriggerServerCallback('jobcreator:getAllJobs', function(jobs)
        print('[Job Creator Client] Received callback response: ' .. type(jobs))
        if jobs then
            print('[Job Creator Client] Jobs is table: ' .. tostring(type(jobs) == 'table'))
            if type(jobs) == 'table' then
                print('[Job Creator Client] Jobs count: ' .. #jobs)
            end
        end
        cb(jobs)
    end)
end)

-- Handle job update from UI
RegisterNuiCallback('updateJob', function(data, cb)
    TriggerServerEvent('jobcreator:server:updateJob', data)
    cb({ success = true })
end)

-- Receive update result from server
RegisterNetEvent('jobcreator:client:updateResult', function(success, message)
    if success then
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'success',
                description = message
            })
        else
            ESX.ShowNotification(message, 'success')
        end
        
        -- Refresh jobs list
        NUI.SendMessage('refreshJobs', {})
    else
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'error',
                description = message
            })
        else
            ESX.ShowNotification(message, 'error')
        end
    end
end)

-- Handle job deletion from UI
RegisterNuiCallback('deleteJob', function(data, cb)
    TriggerServerEvent('jobcreator:server:deleteJob', data.jobName)
    cb({ success = true })
end)

-- Receive delete result from server
RegisterNetEvent('jobcreator:client:deleteResult', function(success, message)
    if success then
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'success',
                description = message
            })
        else
            ESX.ShowNotification(message, 'success')
        end
        
        -- Refresh jobs list and go back
        NUI.SendMessage('jobDeleted', {})
    else
        if Config.Notifications.useOxLib then
            lib.notify({
                type = 'error',
                description = message
            })
        else
            ESX.ShowNotification(message, 'error')
        end
    end
end)

-- ESC key to close UI
if Config.UI.closeOnEscape then
    CreateThread(function()
        while true do
            Wait(0)
            if NUI.IsOpen() and IsControlJustReleased(0, 322) then -- ESC key
                NUI.Close()
            end
        end
    end)
end
