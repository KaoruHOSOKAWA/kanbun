document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const file = files[files.length-1];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        let inputText = e.target.result;
    
        // 置換
        let rubyText = inputText.replace(/\[([^\[]*)\|(.*?)\]/g, '<ruby>$1<rt>$2</rt></ruby>');
        let subText = rubyText.replace(/\[(.*?)\]/g, '<sub>$1</sub>');
        let formattedText = subText.replace(/\r\n|\n|\r/g, '<br>\n');
    
        // innerHTML に挿入
        document.getElementById('kanbun').innerHTML = formattedText;
    };
    reader.readAsText(file);
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const content = document.getElementById('kanbun').innerHTML;
    if (!content) return; // 内容が空の場合はダウンロードしない

    const blob = new Blob([content], { type: 'text/html' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kanbun.html';
    a.click();
    URL.revokeObjectURL(a.href);
});
