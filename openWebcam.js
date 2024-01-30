
document.addEventListener('DOMContentLoaded', function () {
  // Get references to HTML elements
  var video = document.getElementById('webcamVideo');
  var captureButton = document.getElementById('captureButton');
  var recordButton = document.getElementById('recordButton');
  var stopButton = document.getElementById('stopButton');
  var pauseButton = document.getElementById('pauseButton');
  var playButton = document.getElementById('playButton');
  var mediaRecorder;
  var recordedChunks;

  // Event listener for the "Open Webcam" button
  captureButton.addEventListener('click', function () {
    // Check if getUserMedia is supported in the browser
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Get user media with video constraint
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          // Assign the stream to the video element
          video.srcObject = stream;

          // Create a MediaRecorder instance for recording
          mediaRecorder = new MediaRecorder(stream);

          // Event listener for dataavailable event during recording
          mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };

          // Event listener for stopping recording
          mediaRecorder.onstop = function () {
            // Create a Blob from recorded chunks and create a download link
            var blob = new Blob(recordedChunks, { type: 'video/webm' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            document.body.appendChild(a);
            a.click();
          };
        })
        .catch(function (error) {
          console.error('Error accessing webcam:', error);
        });
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
  });

  // Event listener for the "Start Recording" button
  recordButton.addEventListener('click', function () {
    // Check if MediaRecorder is available
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      recordedChunks = [];
      // Start recording
      mediaRecorder.start();
      recordButton.textContent = 'Stop Recording';
      recordButton.style.backgroundColor = 'red';
    } else if (mediaRecorder && mediaRecorder.state === 'recording') {
      // Stop recording
      mediaRecorder.stop();
      recordButton.textContent = 'Start Recording';
      recordButton.style.backgroundColor = '';
    }
  });

  // Event listener for the "Stop Webcam" button
  stopButton.addEventListener('click', function () {
    // Check if MediaRecorder is defined and there's an active stream
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      // Stop recording
      mediaRecorder.stop();
      recordedChunks = []; // Clear recorded chunks
      recordButton.textContent = 'Start Recording';
      recordButton.style.backgroundColor = '';
    }

    // Check if video stream is defined and there's an active stream
    if (video.srcObject) {
      // Stop the video stream
      var tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  });

  // Event listener for the "Pause" button
  pauseButton.addEventListener('click', function () {
    // Pause the video playback
    video.pause();
  });

  // Event listener for the "Play" button
  playButton.addEventListener('click', function () {
    // Resume the video playback
    video.play();
  });
});



