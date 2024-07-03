import * as vscode from 'vscode';
import axios from 'axios';


interface WikiSearchResponse {
    query: {
        search: Array<{
            title: string;
            snippet: string;
            pageid: number;
        }>;
    };
}


export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "sample" is now active!');

    let disposable = vscode.commands.registerCommand('extension.citidigitalhelp', async () => {
        const input = await vscode.window.showInputBox({ prompt: 'Enter text to search' });

        if (!input) {
            vscode.window.showInformationMessage('No input provided');
            return;
        }

        try {
            try {
                const response = await axios.get<WikiSearchResponse>('https://en.wikipedia.org/w/api.php', {
                    params: {
                        action: 'query',
                        list: 'search',
                        srsearch: encodeURIComponent(input),
                        format: 'json'
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    responseType: 'json'
                });
        
                const outputChannel = vscode.window.createOutputChannel('API Results');
                outputChannel.appendLine(JSON.stringify(response.data, null, 2));
                outputChannel.show();
            } catch (error) {
                console.error('Error fetching data:', error);
            }	

        } catch (error) {
            vscode.window.showErrorMessage(`Error fetching API`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
