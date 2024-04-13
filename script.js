
const setText = (id, value) => {
  document
      .getElementById(id).innerHTML = value
}

document
  .getElementById("cameraFileInput")
  .addEventListener("change", function() {
    setText('keyword', '')
    setText('status', '')
    setText('match', '')
    setText('nomatch', '')
    setText('result', '')

    const keyword = document.getElementById("inputValue").value.strip().toLowerCase();
    if (keyword) {
      setText('keyword', `keyword => ${keyword}`)
    } else {
      alert('Input Keyword!')
      return
    }
    
    console.log('file:', this.files[0])
    const blob = window.URL.createObjectURL(this.files[0])
    console.log('blob:', blob)

    document
      .getElementById("pictureFromCamera")
      .setAttribute("src", blob);

    if (blob && Tesseract.createWorker) {
      (async () => {
        console.log('Start');
        setText('status', 'Start')
        console.log('CreateWorker');
        setText('status', 'CreateWorker')
        const worker = await Tesseract.createWorker('eng');
        console.log('Recognize');
        setText('status', 'Recognize')
        const ret = await worker.recognize(blob);

        const text = ret.data.text
        console.log('text:', text);
        setText('result', text)

        const regex = new RegExp(`${keyword}`, 'i');
        if (regex.test(text) ) {
          setText('match', `Keyword Match!`)
        } else {
          setText('nomatch', 'No Match')
        }

        setText('status', 'Success')
        await worker.terminate();
        setStatus('Done!');
        setText('status', 'Done!')
        console.log('Done!');
      })();

    } else {
      console.log('Error:', `blob: ${blob}`, `Tesseract: ${Tesseract}`)
      alert('Error!')
    }
  });


