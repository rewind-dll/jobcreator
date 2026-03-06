Config = {}

-- Admin access control
Config.AdminAccess = {
    -- Use identifiers for specific players
    identifiers = {
        'steam:110000000000000', -- Example Steam identifier
        'license:abc123def456',  -- Example license identifier
    },
    
    -- Use ESX groups (admin, superadmin, etc.)
    groups = {
        'admin',
        'superadmin'
    }
}

-- Command settings
Config.Command = {
    name = 'jobcreator',      -- Command to open the job creator
    description = 'Open the job creator menu (Admin only)'
}

-- UI Settings
Config.UI = {
    closeOnEscape = true,      -- Allow ESC key to close UI
}

-- Job creation settings
Config.JobDefaults = {
    whitelisted = false,       -- Default whitelisted status for new jobs
    autoRefresh = true,        -- Automatically refresh ESX jobs after creation
}

-- Notifications
Config.Notifications = {
    useOxLib = true,           -- Use ox_lib notifications (true) or ESX notifications (false)
}
