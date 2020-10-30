"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//------------------------------------------------------------
const util = __importStar(require("util"));
const cp = __importStar(require("child_process"));
const exec = util.promisify(cp.exec);
const os = __importStar(require("os"));
const os_1 = require("os");
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const fsPromises = fs.promises;
const path_1 = __importDefault(require("path"));
const npmRoute = "//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm";
const registry = `https:${npmRoute}/registry/`;
/**
 * Generates a command line which finds a program or file.
 * @param fileName file name to search
 * @returns a command line for finding a file (ex. `where powershell`)
 */
function generateFindFileCommand(fileName) {
    const currentOS = os.platform();
    let command;
    if (currentOS === "win32") {
        command = "where ";
    }
    else if (currentOS === "linux") {
        command = "type ";
    }
    else if (currentOS === "darwin") {
        command = "which ";
    }
    else {
        throw new Error(`unsupported os ${currentOS} please reach out to add support`);
    }
    return command + fileName;
}
/**
 * Checks if a file or program exists.
 * @param fileName file name to search.
 * @returns true if a file exists, false if a file doesn't exist
 */
async function checkFileExists(fileName) {
    const command = generateFindFileCommand(fileName);
    const result = await executeCommand(command);
    if (!result) {
        console.log(`\tResult: (${result}) "${fileName}" does not exist.${os_1.EOL}`);
    }
    return result;
}
/**
 * Executes a command line
 * @param command command line to execute
 * @returns Promise, true if successfully executed command, false otherwise
 */
async function executeCommand(command) {
    let response;
    try {
        response = await exec(command);
        console.log(`**Executing: "${command}", found at path ${response.stdout}`);
    }
    catch (error) {
        console.log(`**Executing: "${command}"`);
        return false;
    }
    return response && !response.stderr;
}
/**
 * Runs commands to find if programs exist in the machine
 * in order: msbuild, nuget, npm, node, script language
 * @param todoList a list that contains instruction if program does not exist.
 * @param requirements map that contains key:programName, value:instruction if program does not exist.
 * @returns array of installation instruction for missing programs
 */
async function checkRequirements(todoList, requirements) {
    for (const [key, value] of requirements) {
        if (!await checkFileExists(key)) {
            todoList.push(value);
        }
    }
    return todoList;
}
/**
 * Generate .npmrc file with the given contents in the path.
 * @param path path to a file (.npmrc)
 * @param contents contents to write in .npmrc file
 */
async function generateNpmrcFile(path, contents) {
    console.log(`Creating .npmrc file: path: ${path}...`);
    let filehandle;
    try {
        filehandle = await fsPromises.open(path, "w+");
        for (const content of contents) {
            await filehandle.write(`${content}${os_1.EOL}`);
        }
    }
    catch (error) {
        console.log("ERROR: Cannot create .npmrc file.");
        throw error;
    }
    finally {
        if (filehandle) {
            filehandle.close();
        }
    }
    console.log("Successfully created .npmrc file!");
}
/**
 * Checks if the given file match aginst list of regular expression
 * @param path a path to a file
 * @param regexs list of regex to match to file
 * @returns true if a given file match aginst list of regular expression.
 */
async function checkContents(path, regexs) {
    const datas = await fsPromises.readFile(path, "utf8");
    for (const reg of regexs) {
        if (datas.toString().match(reg) === null) {
            return false;
        }
    }
    return true;
}
/**
 * Generates NPM Personal Access Token(PAT) for Windows.
 * Checks if PAT exists for non Windows.
 */
async function generateNpmPAT() {
    if (os.platform() === "linux" || os.platform() === "darwin") {
        await checkPATNonWindows();
    }
    const setNpmRegistry = `npm config set registry ${registry}`;
    console.log("Setting the default npm registry...");
    await exec(setNpmRegistry);
    if (os.platform() === "win32") {
        console.log("Check if 'vsts-npm-auth' exists...");
        if (!await checkFileExists("vsts-npm-auth")) {
            console.log(`Please ensure vsts-npm-auth is available on your path.`);
            console.log(`Installing 'vsts-npm-auth'...`);
            await exec(`npm install -g vsts-npm-auth --registry https://registry.npmjs.org`);
        }
        const generatePAT = "vsts-npm-auth -F -R -E 525600 -C .npmrc";
        console.log(`generating a readonly PAT using vsts-npm-auth...${os_1.EOL}If prompted to login, use your @microsoft.com account to authenticate against Azure Dev Ops.`);
        await exec(generatePAT);
    }
    console.log("Successfully set npm registry and generated PAT.");
}
/**
 * Check if Personal Access Token exists in user .npmrc file for non Windows platforms
 */
async function checkPATNonWindows() {
    const contents = ["; begin auth token",
        `${npmRoute}/registry/:username=msazure`,
        `${npmRoute}/registry/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]`,
        `${npmRoute}/registry/:email=npm requires email to be set but doesnt use the value`,
        `${npmRoute}/:username=msazure`,
        `${npmRoute}/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]`,
        `${npmRoute}/:email=npm requires email to be set but doesnt use the value`,
        "; end auth token"];
    const regexs = [/\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/registry\/\:username=.*$/gm,
        /\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/registry\/\:\_password=.*$/gm,
        /\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/registry\/\:email=.*$/gm,
        /\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/\:username=.*$/gm,
        /\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/\:\_password=.*$/gm,
        /\/\/msazure\.pkgs\.visualstudio\.com\/_packaging\/AzurePortal\/npm\/\:email=.*$/gm];
    const passWordRegex = [/\_password\=\"?\[(BASE64_ENCODED_PERSONAL_ACCESS_TOKEN)\]\"?$/gm];
    const userNpmrcPath = path_1.default.join(process.env.HOME, ".npmrc");
    console.log();
    await checkNpmrcFile(userNpmrcPath, contents, regexs, process.env.HOME);
    console.log(`Check if .npmrc has encoded Personal Access Token...`);
    if (await checkContents(userNpmrcPath, passWordRegex)) {
        throw new Error(`Generate a Personal Access Token by following the manual instruction.`);
    }
}
/**
 * Checks if .npmrc file exists. If doesn't exists, create a new .npmrc file.
 * Then, checks the contents of the .npmrc file, if not has proper contents, throw an error with instruction.
 * @param path a path to a file
 * @param contents contents of .npmrc file
 * @param regexs list of regexs to check the contents
 * @param location location path of a file
 */
async function checkNpmrcFile(path, contents, regexs, location) {
    try {
        console.log(`Checking if .npmrc file exists in ${location} directory...`);
        await fsPromises.stat(path);
        console.log(`.npmrc file found in ${location} directory.`);
    }
    catch (error) {
        console.log(".npmrc file does not exist.");
        if (error.code === "ENOENT") {
            await generateNpmrcFile(path, contents);
        }
        else {
            throw error;
        }
    }
    console.log(`Checking the contents of .npmrc file in the ${location} directory...`);
    if (!await checkContents(path, regexs)) {
        console.log("Error:");
        console.log(".npmrc file should contain: ");
        for (const line of contents) {
            console.log("\t", line);
        }
        throw Error(`Please add these lines to .npmrc file in the ${location} directory.`);
    }
    console.log(".npmrc file contains proper content.");
}
/**
 * Sets NPM Auth Personal Access Token(PAT)
 * Checks if .npmrc file exists. If doesn't exists, create a new .npmrc file.
 * Then, checks the contents of the .npmrc file, if not has proper contents, throw an error.
 * Then, sets npm registry and generates PAT.
 */
async function setNPMAuthPAT() {
    const contents = [`registry=${registry}`, "always-auth=true"];
    const regexs = [/(registry=https:\/\/(msazure\.pkgs\.visualstudio\.com)\/_packaging\/AzurePortal\/npm\/registry(\/)?)$/gmi,
        /^(always-auth=true)$/gmi];
    const path = ".npmrc";
    await checkNpmrcFile(path, contents, regexs, "current");
    await generateNpmPAT();
}
/**
 * Download the given url to given fileName
 * @param url link given to download
 * @param tmpPath $TMP path i.e. process.env.tmp
 * @param fileName fileName to write
 * @returns Promise.resolve after file downloaded to disk
 */
async function downloadScript(url, tmpPath, fileName) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error("Failed to load page: response.statusCode: " + response.statusCode));
            }
            const actualPath = path_1.default.join(tmpPath, fileName);
            const writer = fs.createWriteStream(actualPath);
            console.log(actualPath);
            response.on("data", (data) => {
                writer.write(data.toString());
            });
            response.on("end", () => {
                writer.close();
                console.log("Closing writer...");
                resolve();
            });
        }).on("error", (error) => {
            console.log("Error: Invalid url or fileName. ");
            reject(error);
        });
    });
}
/**
 * Run Credential Provider script.
 * Here, run `installcredprovider.ps1 -addNetfx` in Powershell or run `bash installcredprovider.sh` based on os platform
 * @param currentOS current OS platform
 * @param tmpPath $TMP Path i.e. process.env.tmp
 * @param fileName fileName to run
 */
async function runCredProviderScript(currentOS, tmpPath, fileName) {
    let credProviderCmd = "";
    const actualPath = path_1.default.join(tmpPath, fileName);
    if (currentOS === "win32") {
        credProviderCmd = `powershell.exe -ExecutionPolicy Bypass ${actualPath} -AddNetfx`;
    }
    else if (currentOS === "linux" || currentOS === "darwin") {
        credProviderCmd = `bash ${actualPath}`;
    }
    console.log(`Running ${credProviderCmd}`);
    console.log("You will need to sign in if prompted...");
    const result = await exec(credProviderCmd);
    console.log(result.stdout);
}
/**
 * Get NuGet Version.
 * @returns version of NuGet
 */
async function getNugetVersion() {
    const nugetHelp = await exec("nuget help");
    const nugetInfo = nugetHelp.stdout;
    const version = nugetInfo.toString().match(/^NuGet Version: ((\d+\.\d)+\.\d+.*)$/mi);
    if (version === null || version.length !== 3) {
        throw new Error(`Cannot find NuGet Version.
         Please ensure NuGet is available on the path, you can download latest from https://www.nuget.org/downloads`);
    }
    return Number(version[2]);
}
/**
 * Set NuGet Credential Provider
 * Automatically updates if NuGet's version is below 5.5.x.
 * Download the installcredprobider.ps1 from github and run the powershell script.
 * @param currentOS current OS platform
 */
async function setNugetCredentialProvider(currentOS) {
    let tmpPath = process.env.tmp;
    let url = "";
    let fileName = "";
    if (currentOS === "win32") {
        tmpPath = process.env.tmp;
        url = "https://raw.githubusercontent.com/microsoft/artifacts-credprovider/master/helpers/installcredprovider.ps1";
        fileName = "installcredprovider.ps1";
        const minimumNugetVersion = 5.5;
        const updateNugetVersion = "nuget update -self";
        console.log("Checking Nuget version...");
        let currNugetVersion = await getNugetVersion();
        if (currNugetVersion < minimumNugetVersion) {
            console.log("Update NuGet to the most recent version...");
            if (!await executeCommand(updateNugetVersion)) {
                console.log("Please install NuGet version 5.5.x or later.");
                throw Error();
            }
            currNugetVersion = await getNugetVersion();
        }
        console.log("Current NuGet version: ", currNugetVersion);
        console.log("Downloading powershell script...");
    }
    else if (currentOS === "linux" || currentOS === "darwin") {
        url = "https://raw.githubusercontent.com/microsoft/artifacts-credprovider/master/helpers/installcredprovider.sh";
        fileName = "installcredprovider.sh";
        tmpPath = process.env.tmp || "/tmp";
        console.log("Downloading bash script...");
    }
    await downloadScript(url, tmpPath, fileName);
    console.log("Finished downloading...");
    await runCredProviderScript(currentOS, tmpPath, fileName);
}
/**
 * Check whether the .Net Framework 4.7.2 or later is installed.
 * @returns true if version is 4.7.2 or later is installed, false otherwise.
 */
async function checkDotNetFxVersion() {
    const command = `powershell.exe (Get-ItemProperty "HKLM:SOFTWARE\\Microsoft\\'NET Framework Setup'\\NDP\\v4\\Full").Release`;
    try {
        const result = await exec(command);
        if (!result.stderr && Number(result.stdout) >= 461808) {
            console.log(`**Executing: "${command}",
             .Net Framework found with version 4.7.2 or later${os_1.EOL}`);
            return true;
        }
        throw new Error();
    }
    catch (error) {
        console.log(`**Executing: "${command}"`);
        console.log(`\tResult: (false) ".Net Framework" does not exist.${os_1.EOL}`);
    }
    return false;
}
/**
 * Helper method for prining message in console.
 * @param message message to print in console
 */
function messageBox(message) {
    console.log();
    console.log("************************************************************************************************************");
    console.log(message);
    console.log("************************************************************************************************************");
}
/**
 * Check requirements for Window platform
 * @param todoList a list that contains instruction if program does not exist.
 * @returns array of installation instruction for missing programs
 */
async function checkWindowRequirements(todoList) {
    const nugetInstruction = `nuget:: Please follow instruction:
    1. Download the latest "Nuget" from https://www.nuget.org/downloads and add it to "C:/users/{youralias}/.nuget" folder.
    2. Add 'C:/users/{youralias}/.nuget' to your PATH.`;
    const requirements = new Map([
        ["msbuild", `msbuild:: Please ensure "MSBuild" is available on the path, you can download it from
        https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16`],
        ["powershell", `powershell:: Please ensure "PowerShell" is available on your path.`],
        ["nuget", nugetInstruction],
    ]);
    todoList = await checkRequirements(todoList, requirements);
    if (!await checkDotNetFxVersion()) {
        todoList.push(`.Net Framework:: Please install ".Net Framework 4.7.2 Developer Pack" from
        https://dotnet.microsoft.com/download/dotnet-framework/thank-you/net472-developer-pack-offline-installer`);
    }
    return todoList;
}
/**
 * Check requirements for non Window (Linux, Mac) platform
 * @param todoList a list that contains instruction if program does not exist.
 * @returns array of installation instruction for missing programs
 */
async function checkNonWindowRequirements(todoList) {
    const dotnetSDKInstruction = `dotnet:: Please follow instruction:
    1. Ensure ".NET Core SDK" is installed and dotnet.exe is available on your path,
        you can download it from https://dotnet.microsoft.com/download
        If you need to Install .Net Core on Ubuntu,
        you can install by following: https://docs.microsoft.com/en-us/dotnet/core/install/linux-ubuntu`;
    const requirements = new Map([
        ["dotnet", dotnetSDKInstruction],
        ["bash", `bash:: Please ensure "bash" is available on your path.`],
    ]);
    todoList = await checkRequirements(todoList, requirements);
    return todoList;
}
/**
 * Throws detailed errors and instruction if error occurs
 * @param currentOS current OS platform
 * @param error error
 * @param nonWindowsInstruction instruction for non Window platforms
 * @param windowsInstruction instruction for Windows
 */
function throwingDetailedErrors(currentOS, error, nonWindowsInstruction, windowsInstruction) {
    if (currentOS === "linux" || currentOS === "darwin") {
        throw Error(`${error} ${os_1.EOL}${os_1.EOL} ${nonWindowsInstruction}`);
    }
    else if (currentOS === "win32") {
        throw Error(`${error} ${os_1.EOL} ${windowsInstruction}`);
    }
}
/**
 * One Time Configuration Steps
 */
async function oneTimeConfigurationSteps() {
    const commonRequirements = new Map([
        ["git", `git:: Please ensure "git" is installed on path. You can download it from https://git-scm.com/download/win`],
        ["node", `node:: Please ensure "NodeJS" is available on the path, you can download lastest from https://nodejs.org/en/download/`],
        ["npm", `npm:: Please ensure "NodeJS" is available on the path, you can download lastest from https://nodejs.org/en/download/`],
    ]);
    const WindowAddToPathInstruction = `Please add items to the PATH as follows:
    1. Press 'WindowsKey + R'
    2. Type 'rundll32.exe sysdm.cpl,EditEnvironmentVariables'
    3. In the dialog click 'Edit' on the 'Path' variable from 'User variables for {youralias}' section
        and click 'New' to add path (note paths may vary depending on your environment and msbuild version)
        replace {youralias} with your own alias
        examples:
        - for npm: C:\\Users\\{youralias}\\AppData\\Roaming\\npm
        - for nuget: and cred provider C:\\Users\\{youralias}\\.nuget
        - for msbuild: C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\MSBuild\\Current\\Bin
    4. Open a new command prompt to pickup the updated path and run this 'setup.js' file again`;
    const nonWindowAddToPathInstruction = `Please add items to the PATH as follows:
    1. Open command prompt
    2. Add new path to the PATH variable using export command.
        examples:
        - 'export PATH=$PATH:/some/new/path'
        - for dotnet: 'export PATH=$PATH:/home/t-yejlee/.dotnet/tools'
        - for npm: 'export PATH=$PATH:C:\\Users\\{youralias}\\AppData\\Roaming\\npm'
    4. Open a new command prompt to pickup the updated path and run this 'setup.js' file again`;
    const windowsNugetCredProvInstruction = `Manual Instruction:
    1. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal
    2. Select NuGet.exe under the NuGet header
    3. Click the 'Get the tools' button in the top right corner
    4. Follow steps 1 and 2 to download the latest NuGet version and the credential provider.
    5. rerun this "setup.js" file`;
    const nonWindowsCredProvNonInstruction = `Manual Instruction:
    1. Set TMP environment variable: type " export TMP = '/tmp' " this to command prompt.
        i. (Optional) If you do not want to go through the manual installation, try running the "setup.js" file again.
    2. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal
    3. Select NuGet.exe under the NuGet header
    4. Click the 'Get the tools' button in the top right corner
    5. Follow step2 to download the credential provider under 'Installation on Linux and Mac' section.
    6. rerun this "setup.js" file`;
    const windowsNPMAuthPATInstruction = `Manual Instruction: Just as NuGet needed the credential provider npm requires a PAT for auth. Which can be configured as follows.
    1. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal
    2. Click Connect to Feed, then select npm
    3. Click the 'Get the tools' button in the top right corner
    4. Optional. install node.js and npm if not already done so.
    5. Follow step 2 to install vsts-npm-auth node.
    6. Add a .npmrc file to your project, in the same directory as your package.json
        registry=${registry}
        always-auth=true
    7. From the command prompt in the same directory:
        - set the default npm registry (copy and paste below line to command prompt)
            npm config set registry ${registry}
        - generate a readonly PAT using vsts-npm-auth (copy and paste below line to command prompt)
            vsts-npm-auth -F -R -E 525600 -C .npmrc
    8. rerun this "setup.js" file`;
    const nonWindowsNPMAuthPATHInstruction = `Manual Instruction: Just as NuGet needed the credential provider npm requires a PAT for auth. Which can be configured as follows.
    1. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal
    2. Click Connect to Feed, then select npm
    3. Click 'Other' in Project setup
    4. Follow Step 1 to Step 4.
    5. rerun this "setup.js" file`;
    console.log("Make sure to place this `setup.js` file inside the project. ");
    messageBox("Running to check if required programs exist in machine...");
    const currentOS = os.platform();
    let todoList = [];
    if (currentOS === "win32") {
        todoList = await checkWindowRequirements(todoList);
    }
    else if (currentOS === "linux" || currentOS === "darwin") {
        todoList = await checkNonWindowRequirements(todoList);
    }
    else {
        throw new Error(`unsupported os ${currentOS} please reach out to add support`);
    }
    todoList = await checkRequirements(todoList, commonRequirements);
    if (todoList.length === 0) {
        messageBox(`All programs are available on the path`);
        try {
            try {
                messageBox("Set NPM Auth Personal Access Token(PAT)...");
                await setNPMAuthPAT();
            }
            catch (error) {
                throwingDetailedErrors(currentOS, error, nonWindowsNPMAuthPATHInstruction, windowsNPMAuthPATInstruction);
            }
            try {
                messageBox("Set NuGet Credential Provider...");
                await setNugetCredentialProvider(currentOS);
            }
            catch (error) {
                throwingDetailedErrors(currentOS, error, nonWindowsCredProvNonInstruction, windowsNugetCredProvInstruction);
            }
            messageBox(`One time configuration steps completed.${os_1.EOL}Running install of ap cli using command 'npm install -g @microsoft/azureportalcli@latest' ...`);
            //spawn install, no need to wait
            cp.spawn(os.platform() === "win32" ? "npm.cmd" : "npm", ["install", "-g", "@microsoft/azureportalcli@latest"], { stdio: "inherit" });
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        messageBox(`Error: Please ensure these programs are available on the path.`);
        console.log(`*** After installing all items and adding items to the PATH, start new command prompt and rerun "setup.js" file again.${os_1.EOL}`);
        for (const instruction of todoList) {
            console.log(instruction);
            console.log();
        }
        if (currentOS === "win32") {
            console.log(WindowAddToPathInstruction);
        }
        else if (currentOS === "linux" || currentOS === "darwin") {
            console.log(nonWindowAddToPathInstruction);
        }
        console.log(`*** After installing all items and adding items to the PATH, start new command prompt and rerun "setup.js" file again.`);
    }
}
oneTimeConfigurationSteps();
