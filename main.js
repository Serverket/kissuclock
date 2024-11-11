const { app, BrowserWindow, Tray, Menu } = require('electron');  
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
    tray = new Tray(path.join(__dirname, 'clock-icon.png')); // Path to your tray icon  
    const contextMenu = Menu.buildFromTemplate([  
        { label: 'Show', click: () => { mainWindow.show(); } },  
        { label: 'Hide', click: () => { mainWindow.hide(); } }, // New Hide option  
        { label: 'Quit', click: () => { app.quit(); } } // Exiting the application  
    ]);  
    
    tray.setToolTip('KISS UClock');  
    tray.setContextMenu(contextMenu);  
    
    tray.on('click', () => {  
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();  
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