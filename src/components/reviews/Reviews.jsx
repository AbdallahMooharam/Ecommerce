import React, { useState, useEffect, useRef } from 'react';
import './Reviews.css'; // Ensure this file exists

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [user, setUser] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editText, setEditText] = useState('');
  const [image, setImage] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('loggedInUser');
    if (!loggedInEmail) {
      window.location.href = '/profile';
      return;
    }

    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const updatedReviews = storedReviews.map(review => ({
      ...review,
      reactions: review.reactions || { happy: 0, sad: 0 },
    }));
    setReviews(updatedReviews);

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = storedUsers.find(user => user.email === loggedInEmail);
    setUser(currentUser);
  }, []);

  const handleAddReview = () => {
    if (!newReview.trim() && !audioBlob) return;

    const newReviewObj = {
      id: Date.now(),
      text: newReview,
      user: user.email,
      reactions: { happy: 0, sad: 0 },
      image: image,
      audio: audioUrl
    };

    const updatedReviews = [...reviews, newReviewObj];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setNewReview('');
    setImage(null);
    setAudioBlob(null);
    setAudioUrl('');
  };

  const handleEditReview = (id) => {
    setEditReviewId(id);
    const review = reviews.find(r => r.id === id);
    setEditText(review.text);
  };

  const handleSaveEdit = () => {
    const updatedReviews = reviews.map(review =>
      review.id === editReviewId
        ? { ...review, text: editText }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setEditReviewId(null);
    setEditText('');
  };

  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const handleReaction = (reviewId, reactionType) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? { ...review, reactions: { ...review.reactions, [reactionType]: review.reactions[reactionType] + 1 } }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(stream);
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setIsRecording(true);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const audioBlob = event.data;
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      }
    };
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  };

  return (
    <div className="reviews-container">
      <h2>User Reviews</h2>
      <div className="review-input">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review here..."
        />
        <label htmlFor="file-upload" className="file-upload-label">Choose File</label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {image && <img src={image} alt="Review" className="review-image-preview" />}
        <div className="audio-controls">
          {isRecording ? (
            <button onClick={stopRecording} className="record-button">Stop Recording</button>
          ) : (
            <button onClick={startRecording} className="record-button">Start Recording</button>
          )}
          {audioUrl && (
            <audio controls src={audioUrl} className="audio-preview"></audio>
          )}
        </div>
        <button onClick={handleAddReview} className="submit-button">Add Review</button>
      </div>
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            {editReviewId === review.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={handleSaveEdit} className="submit-button">Save</button>
              </>
            ) : (
              <>
                <div className="review-header">
                  <strong>{review.user}</strong>
                </div>
                <p>{review.text}</p>
                {review.image && <img src={review.image} alt="Review" className="review-image" />}
                {review.audio && (
                  <audio controls src={review.audio} className="audio-preview"></audio>
                )}
                <div className="review-reactions">
                  <span 
                    onClick={() => handleReaction(review.id, 'happy')} 
                    role="img" 
                    aria-label="happy"
                  >
                    😊 {review.reactions.happy}
                  </span>
                  <span 
                    onClick={() => handleReaction(review.id, 'sad')} 
                    role="img" 
                    aria-label="sad"
                  >
                    😢 {review.reactions.sad}
                  </span>
                </div>
                {user && user.email === review.user && (
                  <div className="review-actions">
                    <button onClick={() => handleEditReview(review.id)}>Edit</button>
                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
