
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Share2, Heart, Music, Upload, Plus, X, Sparkles } from 'lucide-react';

const MoodMusicPlayer = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [likedSongs, setLikedSongs] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedSongs, setUploadedSongs] = useState({});
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const moods = [
    { id: 'happy', name: 'Happy', emoji: '😊', color: 'from-yellow-400 to-orange-500' },
    { id: 'chill', name: 'Chill', emoji: '😌', color: 'from-blue-400 to-cyan-500' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡', color: 'from-red-500 to-pink-500' },
    { id: 'sad', name: 'Sad', emoji: '😢', color: 'from-gray-400 to-blue-400' },
    { id: 'focus', name: 'Focus', emoji: '🎯', color: 'from-purple-400 to-indigo-500' },
    { id: 'romantic', name: 'Romantic', emoji: '💕', color: 'from-pink-400 to-rose-500' }
  ];

  const genres = {
    happy: [
      { id: 'sunshine', name: '☀️ Sunshine Vibes', description: 'Uplifting and bright tunes' },
      { id: 'dance', name: '💃 Dance Party', description: 'Get up and move!' },
      { id: 'pop', name: '🎤 Pop Hits', description: 'Catchy and fun songs' }
    ],
    chill: [
      { id: 'lofi', name: '🎧 Lo-fi Beats', description: 'Relaxing instrumental vibes' },
      { id: 'acoustic', name: '🎸 Acoustic Chill', description: 'Soft guitar melodies' },
      { id: 'ambient', name: '🌊 Ambient Waves', description: 'Peaceful soundscapes' }
    ],
    energetic: [
      { id: 'workout', name: '💪 Workout Pump', description: 'High-energy motivation' },
      { id: 'edm', name: '🔥 EDM Bangers', description: 'Electronic dance music' },
      { id: 'rock', name: '🎸 Rock Energy', description: 'Powerful rock anthems' }
    ],
    sad: [
      { id: 'melancholy', name: '🌧️ Rainy Thoughts', description: 'Emotional and deep' },
      { id: 'piano', name: '🎹 Piano Ballads', description: 'Beautiful piano pieces' },
      { id: 'indie', name: '🍂 Indie Feels', description: 'Alternative sad vibes' }
    ],
    focus: [
      { id: 'classical', name: '🎻 Classical Focus', description: 'Timeless concentration' },
      { id: 'study', name: '📚 Study Beats', description: 'Perfect for productivity' },
      { id: 'instrumental', name: '🎼 Instrumentals', description: 'No lyrics, pure focus' }
    ],
    romantic: [
      { id: 'love', name: '❤️ Love Songs', description: 'Heartfelt romance' },
      { id: 'slow', name: '🌹 Slow Dance', description: 'Intimate and tender' },
      { id: 'jazz', name: '🎷 Jazz Romance', description: 'Smooth jazz vibes' }
    ]
  };

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const result = await window.storage.get('uploaded-songs');
        if (result) {
          setUploadedSongs(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No saved songs found');
      }
    };
    loadSongs();
  }, []);

  useEffect(() => {
    const saveSongs = async () => {
      if (Object.keys(uploadedSongs).length > 0) {
        try {
          await window.storage.set('uploaded-songs', JSON.stringify(uploadedSongs));
        } catch (error) {
          console.error('Error saving songs:', error);
        }
      }
    };
    saveSongs();
  }, [uploadedSongs]);

  const defaultLibrary = {
    happy: {
      sunshine: [{ title: 'Sunshine Vibes', artist: 'Feel Good Band', duration: '3:45', isDefault: true }],
      dance: [{ title: 'Dancing Days', artist: 'Happy Souls', duration: '4:12', isDefault: true }],
      pop: [{ title: 'Good Morning', artist: 'Bright Side', duration: '3:28', isDefault: true }]
    },
    chill: {
      lofi: [{ title: 'Lazy Sunday', artist: 'Lofi Dreams', duration: '4:45', isDefault: true }],
      acoustic: [{ title: 'Coffee Shop', artist: 'Mellow Tones', duration: '3:55', isDefault: true }],
      ambient: [{ title: 'Ocean Waves', artist: 'Calm Collective', duration: '5:20', isDefault: true }]
    },
    energetic: {
      workout: [{ title: 'Power Up', artist: 'Electric Pulse', duration: '3:15', isDefault: true }],
      edm: [{ title: 'Unstoppable', artist: 'High Energy', duration: '3:48', isDefault: true }],
      rock: [{ title: 'Adrenaline Rush', artist: 'Beat Makers', duration: '4:02', isDefault: true }]
    },
    sad: {
      melancholy: [{ title: 'Rainy Days', artist: 'Melancholy Hearts', duration: '4:30', isDefault: true }],
      piano: [{ title: 'Memories', artist: 'Echo Chamber', duration: '5:15', isDefault: true }],
      indie: [{ title: 'Alone', artist: 'Soft Tears', duration: '3:52', isDefault: true }]
    },
    focus: {
      classical: [{ title: 'Deep Work', artist: 'Concentration Zone', duration: '6:00', isDefault: true }],
      study: [{ title: 'Study Mode', artist: 'Brain Waves', duration: '5:30', isDefault: true }],
      instrumental: [{ title: 'Flow State', artist: 'Focus Masters', duration: '5:45', isDefault: true }]
    },
    romantic: {
      love: [{ title: 'Love Story', artist: 'Heart Strings', duration: '4:20', isDefault: true }],
      slow: [{ title: 'Moonlight Dance', artist: 'Romance Band', duration: '3:58', isDefault: true }],
      jazz: [{ title: 'Forever Yours', artist: 'Sweet Melody', duration: '4:35', isDefault: true }]
    }
  };

  const getMusicLibrary = () => {
    const library = JSON.parse(JSON.stringify(defaultLibrary));
    Object.keys(uploadedSongs).forEach(key => {
      const parts = key.split('-');
      const mood = parts[0];
      const genre = parts[1];
      if (library[mood] && library[mood][genre]) {
        library[mood][genre] = [...library[mood][genre], ...uploadedSongs[key]];
      } else if (library[mood]) {
        library[mood][genre] = uploadedSongs[key];
      }
    });
    return library;
  };

  const musicLibrary = getMusicLibrary();
  const currentPlaylist = selectedMood && selectedGenre ? musicLibrary[selectedMood][selectedGenre] : [];
  const currentTrack = currentPlaylist[currentSong];

  useEffect(() => {
    if (isPlaying && currentTrack && currentTrack.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(err => console.log('Play error:', err));
      }
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      nextSong();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  const handleFileUpload = (event, mood, genre) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const audioUrl = e.target.result;
          const audio = new Audio(audioUrl);
          
          audio.addEventListener('loadedmetadata', () => {
            const duration = Math.floor(audio.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const durationStr = minutes + ':' + String(seconds).padStart(2, '0');
            
            const newSong = {
              title: file.name.replace(/\.[^/.]+$/, ""),
              artist: 'My Music',
              duration: durationStr,
              audioUrl: audioUrl,
              isDefault: false
            };

            const key = mood + '-' + genre;
            setUploadedSongs(prev => ({
              ...prev,
              [key]: [...(prev[key] || []), newSong]
            }));
          });
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    setShowUploadModal(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % currentPlaylist.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleLike = () => {
    const songId = selectedMood + '-' + selectedGenre + '-' + currentSong;
    setLikedSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const sharePlaylist = () => {
    const currentGenre = genres[selectedMood].find(g => g.id === selectedGenre);
    const genreName = currentGenre ? currentGenre.name : '';
    const shareText = 'Check out my ' + genreName + ' playlist!\n\nSongs:\n' + currentPlaylist.map((s, i) => (i + 1) + '. ' + s.title + ' - ' + s.artist).join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'My Mood Playlist',
        text: shareText
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(shareText);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 2000);
    }
  };

  const deleteSong = (mood, genre, index) => {
    const key = mood + '-' + genre;
    setUploadedSongs(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const currentMood = moods.find(m => m.id === selectedMood);
  const isLiked = likedSongs.includes(selectedMood + '-' + selectedGenre + '-' + currentSong);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <audio ref={audioRef} />
        
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Music className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400" />
            MoodTunes
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Play music that matches your vibe</p>
        </div>

        {!selectedMood && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={'bg-gradient-to-br ' + mood.color + ' p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 touch-manipulation'}
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4">{mood.emoji}</div>
                <div className="text-white text-lg sm:text-xl lg:text-2xl font-bold">{mood.name}</div>
              </button>
            ))}
          </div>
        )}

        {selectedMood && !selectedGenre && (
          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={() => setSelectedMood(null)}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 touch-manipulation"
            >
              ← Back to Moods
            </button>
            
            <div className={'bg-gradient-to-br ' + currentMood.color + ' rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 mb-4 sm:mb-6'}>
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">{currentMood.emoji}</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{currentMood.name} Playlists</h2>
              <p className="text-white/80 text-sm sm:text-base">Choose your vibe</p>
            </div>

            <div className="grid gap-3 sm:gap-4">
              {genres[selectedMood].map(genre => {
                const songCount = musicLibrary[selectedMood][genre.id] ? musicLibrary[selectedMood][genre.id].length : 0;
                return (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className="bg-white/5 backdrop-blur-xl hover:bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all transform hover:scale-102 group text-left touch-manipulation"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors truncate">
                          {genre.name}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm lg:text-base line-clamp-1">{genre.description}</p>
                        <p className="text-white/40 text-xs sm:text-sm mt-1 sm:mt-2">{songCount} tracks</p>
                      </div>
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedMood && selectedGenre && currentTrack && (
          <div className="space-y-4 sm:space-y-6">
            <div className={'bg-gradient-to-br ' + currentMood.color + ' rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl'}>
              <div className="flex justify-between items-start mb-4 sm:mb-6 gap-2">
                <button
                  onClick={() => { setSelectedGenre(null); setIsPlaying(false); setProgress(0); setCurrentSong(0); }}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors touch-manipulation"
                >
                  ← Back
                </button>
                <button
                  onClick={sharePlaylist}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 text-white transition-all text-sm touch-manipulation"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 mb-4 sm:mb-6 text-center">
                <div className="text-5xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4">{currentMood.emoji}</div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{currentTrack.title}</h2>
                <p className="text-white/80 text-base sm:text-lg lg:text-xl line-clamp-1">{currentTrack.artist}</p>
                {currentTrack.isDefault && (
                  <span className="inline-block mt-2 text-white/60 text-xs sm:text-sm">(Demo Track)</span>
                )}
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="bg-white/20 h-1.5 sm:h-2 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-100"
                    style={{ width: progress + '%' }}
                  />
                </div>
                <div className="flex justify-between text-white/70 text-xs sm:text-sm mt-2">
                  <span>{Math.floor(progress / 100 * 240)}:{String(Math.floor((progress / 100 * 240) % 60)).padStart(2, '0')}</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                <button
                  onClick={prevSong}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 sm:p-4 rounded-full transition-all transform active:scale-95 touch-manipulation"
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={togglePlay}
                  className="bg-white hover:bg-white/90 p-4 sm:p-5 lg:p-6 rounded-full transition-all transform active:scale-95 shadow-lg touch-manipulation"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black ml-0.5 sm:ml-1" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 sm:p-4 rounded-full transition-all transform active:scale-95 touch-manipulation"
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={toggleLike}
                  className={'transition-all transform active:scale-95 touch-manipulation ' + (isLiked ? 'text-red-400' : 'text-white/60')}
                >
                  <Heart className={'w-5 h-5 sm:w-6 sm:h-6 ' + (isLiked ? 'fill-current' : '')} />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-16 sm:w-20 lg:w-24 accent-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
                <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold truncate">
                  {genres[selectedMood].find(g => g.id === selectedGenre).name}
                </h3>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-purple-500/20 hover:bg-purple-500/30 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 text-white transition-all text-xs sm:text-sm flex-shrink-0 touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              
              <div className="space-y-2 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto">
                {currentPlaylist.map((song, idx) => (
                  <div
                    key={idx}
                    className={'flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all ' + (idx === currentSong ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10')}
                  >
                    <button
                      onClick={() => { setCurrentSong(idx); setProgress(0); setIsPlaying(true); }}
                      className="flex-1 text-left min-w-0 touch-manipulation"
                    >
                      <div className="text-white font-medium text-sm sm:text-base truncate">{song.title}</div>
                      <div className="text-white/60 text-xs sm:text-sm truncate">{song.artist}</div>
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="text-white/60 text-xs sm:text-sm">{song.duration}</div>
                      {!song.isDefault && (
                        <button
                          onClick={() => {
                            const key = selectedMood + '-' + selectedGenre;
                            const uploadedIndex = uploadedSongs[key] ? uploadedSongs[key].findIndex(
                              s => s.title === song.title && s.audioUrl === song.audioUrl
                            ) : -1;
                            if (uploadedIndex !== -1) {
                              deleteSong(selectedMood, selectedGenre, uploadedIndex);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors touch-manipulation"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 max-w-md w-full max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Add Track</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white/60 hover:text-white transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <p className="text-white/80 mb-4 text-sm sm:text-base">
                Adding to: <span className="font-bold break-words">{genres[selectedMood].find(g => g.id === selectedGenre).name}</span>
              </p>
              
              <label className="block">
                <div className="border-2 border-dashed border-white/30 hover:border-white/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-white/5 hover:bg-white/10 touch-manipulation">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-white/60 mx-auto mb-2 sm:mb-3" />
                  <p className="text-white font-medium mb-1 text-sm sm:text-base">Click to upload</p>
                  <p className="text-white/60 text-xs sm:text-sm">MP3, WAV, OGG, M4A</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, selectedMood, selectedGenre)}
                />
              </label>
            </div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg z-50 text-xs sm:text-sm lg:text-base max-w-[90%] text-center">
            Playlist copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMusicPlayer;