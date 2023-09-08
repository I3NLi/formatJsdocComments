"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const chai_1 = require("chai");
suite('JSDoc Formatter Extension Tests', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('Formatting JSDoc Comments', async () => {
        // 打开一个测试文件
        const testFilePath = path.join(__dirname, '..', '..', 'testFixture', 'test.js');
        const document = await vscode.workspace.openTextDocument(vscode.Uri.file(testFilePath));
        const editor = await vscode.window.showTextDocument(document);
        // 等待编辑器准备就绪
        await vscode.commands.executeCommand('workbench.action.files.save');
        // 调用插件的格式化命令
        await vscode.commands.executeCommand('extension.formatJSDocComments');
        // 获取格式化后的文本
        const formattedText = editor.document.getText();
        // 验证格式化结果是否符合预期
        const expectedText = `/**
 * This is a JSDoc comment.
 */
function sampleFunction() {
}`;
        (0, chai_1.expect)(formattedText).to.equal(expectedText);
    });
});
//# sourceMappingURL=extension.test.js.map