const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');  
const { autoUpdater } = require('electron-updater');
const path = require('path');  

let mainWindow;  
let tray;  

function createWindow() {  
    mainWindow = new BrowserWindow({  
        width: 800,  
        height: 600,  
        webPreferences: {  
            nodeIntegration: true,  
            contextIsolation: false // Required for using Node.js  
        }  
    });  

    mainWindow.loadFile('index.html');  

    // Show the window when the tray icon is clicked  
    tray = new Tray(path.join(__dirname, 'clock.png'));
    const contextMenu = Menu.buildFromTemplate([  
        { label: 'Show', click: () => { mainWindow.show(); } },  
        { label: 'Hide', click: () => { mainWindow.hide(); } },
        { label: 'Quit', click: () => { app.quit(); } } 
    ]);  
    
    tray.setToolTip('KISS UClock');  
    tray.setContextMenu(contextMenu);  
    
    tray.on('click', () => {  
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();  
    });  

    // Check for updates  
    autoUpdater.checkForUpdatesAndNotify();  

    // Listen for update events  
    autoUpdater.on('update-available', () => {  
        mainWindow.webContents.send('update_available');  
    });  

    autoUpdater.on('update-downloaded', () => {  
        mainWindow.webContents.send('update_downloaded');  
    });  

    // Modify window close behavior  
    mainWindow.on('close', (event) => {  
        if (!app.isQuiting) {  
            event.preventDefault();  
            mainWindow.hide(); // Hide the window instead of closing  
        }  
    });  

    mainWindow.on('minimize', () => {  
        mainWindow.hide(); // Hide on minimize as well  
    });  

    mainWindow.on('closed', () => {  
        mainWindow = null;  
    });  
}  

app.on('ready', createWindow);  

app.on('window-all-closed', () => {  
    // Quit the app when all windows are closed  
    if (process.platform !== 'darwin') {  
        app.quit();  
    }  
});  

app.on('activate', () => {  
    if (mainWindow === null) {  
        createWindow();  
    }  
});  

// Handle application exit  
app.on('before-quit', () => {  
    app.isQuiting = true; // Flag to indicate app is quitting  
});  

// Restart the app after update  
ipcMain.on('restart_app', () => {  
    autoUpdater.quitAndInstall();  
});