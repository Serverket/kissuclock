const { app, BrowserWindow, Tray, Menu, ipcMain, Notification } = require('electron');  
const path = require('path');  

let mainWindow;  
let tray;  

function createWindow() {  
    mainWindow = new BrowserWindow({  
        width: 800,  
        height: 600,  
        webPreferences: {  
            nodeIntegration: true,  
            contextIsolation: false  
        },  
        icon: path.join(__dirname, 'clock.png')  
    });  

    mainWindow.loadFile('index.html');  

    const menu = Menu.buildFromTemplate([  
        {  
            label: 'Help',  
            submenu: [  
                {  
                    label: 'Source Code',  
                    click: () => {  
                        require('electron').shell.openExternal('https://github.com/Serverket/kissuclock');  
                    }  
                },  
                {   
                    label: 'Quit',   
                    role: 'quit'   
                }  
            ]  
        }  
    ]);  
    
    Menu.setApplicationMenu(menu);  

    mainWindow.on('closed', () => {  
        mainWindow = null;  
    });  
}  

app.on('ready', () => {  
    createWindow();  

    tray = new Tray(path.join(__dirname, 'clock.png'));  
    const contextMenu = Menu.buildFromTemplate([  
        {   
            label: 'Show',   
            click: () => {  
                mainWindow.show();  
            }  
        },  
        {   
            label: 'Hide',   
            click: () => {  
                mainWindow.hide();  
            }  
        },  
        {   
            label: 'Quit',   
            click: () => {  
                app.quit();  
            }   
        }  
    ]);  

    tray.setToolTip('KISS UClock');  
    tray.setContextMenu(contextMenu);  
    tray.on('click', () => {  
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();  
    });  

    tray.on('right-click', () => {  
        const options = { timeStyle: 'short', hour12: true };  
        const timeZones = {  
            "Miami": "America/New_York",  
            "Dallas": "America/Chicago",  
            "Houston": "America/Chicago"  
        };  

        let clocksList = '';  
        for (const [city, tz] of Object.entries(timeZones)) {  
            const cityTime = new Date().toLocaleString("en-US", { timeZone: tz, ...options });  
            clocksList += `${city}: ${cityTime}\n`;  
        }  

        const notification = new Notification({  
            title: 'Current Times',  
            body: clocksList,  
            silent: false,  
        });  

        notification.show();  
    });  
});  

app.on('window-all-closed', () => {  
    if (process.platform !== 'darwin') {  
        app.quit();  
    }  
});  

app.on('activate', () => {  
    if (mainWindow === null) {  
        createWindow();  
    }  
});  

ipcMain.on('restart_app', () => {  
    autoUpdater.quitAndInstall();  
});