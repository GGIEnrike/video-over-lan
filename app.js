// Global variables
let localStream;
let remoteStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let peerConnection;

// STUN server configuration
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Get user media
function getMedia() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
    })
    .catch(error => {
      console.error('Error accessing media devices:', error);
    });
}

// Start the WebRTC connection
function startConnection() {
  // Create peer connection object
  peerConnection = new RTCPeerConnection(configuration);

  // Add local stream to peer connection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle incoming remote stream
  peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
  };

  // Send ICE candidates to remote peer
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      sendIceCandidate(event.candidate);
    }
  };

  // Create offer
  peerConnection.createOffer()
    .then(offer => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      sendOffer(peerConnection.localDescription);
    })
    .catch(error => {
      console.error('Error creating offer:', error);
    });
}

// Send offer to remote peer
function sendOffer(offer) {
  // Send the offer using your signaling server or communication mechanism
  // ...
}

// Receive offer from remote peer
function receiveOffer(offer) {
  // Create peer connection object
  peerConnection = new RTCPeerConnection(configuration);

  // Add local stream to peer connection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle incoming remote stream
  peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
  };

  // Send ICE candidates to remote peer
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      sendIceCandidate(event.candidate);
    }
  };

  // Set remote description
  peerConnection.setRemoteDescription(offer)
    .then(() => {
      // Create answer
      return peerConnection.createAnswer();
    })
    .then(answer => {
      return peerConnection.setLocalDescription(answer);
    })
    .then(() => {
      sendAnswer(peerConnection.localDescription);
    })
    .catch(error => {
      console.error('Error creating or sending answer:', error);
    });
}

// Send answer to remote peer
function sendAnswer(answer) {
  // Send the answer using your signaling server or communication mechanism
  // ...
}

// Receive answer from remote peer
function receiveAnswer(answer) {
  peerConnection.setRemoteDescription(answer)
    .then(() => {
      console.log('Remote description set successfully');
    })
    .catch(error => {
      console.error('Error setting remote description:', error);
    });
}

// Send ICE candidate to remote peer
function sendIceCandidate(candidate) {
  // Send the ICE candidate using your signaling server or communication mechanism
  // ...
}

// Receive ICE candidate from remote peer
function receiveIceCandidate(candidate) {
  peerConnection.addIceCandidate(candidate)
    .then(() => {
      console.log('ICE candidate added successfully');
    })
    .catch(error => {
      console.error('Error adding ICE candidate:', error);
    });
}

// Stop the WebRTC connection
function stopConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}

// Event listeners
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  getMedia();
  startConnection();
});

stopButton.addEventListener('click', () => {
  startButton.disabled = false;
  stopButton.disabled = true;
  stopConnection();
});
