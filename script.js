class Kanbun {
    constructor(text) {
        this.text = text;
        this.outputText = '';
        this.separate = ['[', ']', '|'];
    }

    myPrint(text) {
        this.outputText += text;
    }

    parse() {
        let rubyFlag = false;
        let charsStack = '';
        let charsTemp = '';
        for (let char of this.text) {
            if (!this.separate.includes(char)) {
                charsStack += char;
                continue;
            }
            if (char === '[') {
                this.myPrint(charsStack);
            } else if (char === '|') {
                charsTemp = charsStack;
                rubyFlag = true;
            } else if (char === ']') {
                if (rubyFlag) {
                    this.myPrint(`<ruby>${charsTemp}<rt>${charsStack}</rt></ruby>`);
                    rubyFlag = false;
                } else {
                    this.myPrint(`<sub>${charsStack}</sub>`);
                }
            }
            charsStack = '';
        }
        this.myPrint(charsStack);
    }

    result() {
        return this.outputText;
    }
}


document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const kanbun = new Kanbun(e.target.result.replace(/\n/g, '<br>'));
        kanbun.parse();
        // kanbun.result() の結果を innerHTML に設定
        document.getElementById('kanbun').innerHTML = `<p style="writing-mode: vertical-rl;">${kanbun.result()}</p>`;
    };
    reader.readAsText(file);
});


document.getElementById('downloadButton').addEventListener('click', function() {
    const content = document.getElementById('kanbun').innerHTML;
    if (!content) return; // 内容が空の場合はダウンロードしない

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanbun.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

