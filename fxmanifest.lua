fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Admin Job Creator'
description 'In-game ESX job and grade creation system for administrators'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    '@ox_lib/init.lua',
    'config.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

client_scripts {
    'client/nui.lua',
    'client/main.lua'
}

ui_page 'web/dist/index.html'
files { 'web/dist/**/*' }

dependencies {
    'es_extended',
    'oxmysql',
    'ox_lib'
}
