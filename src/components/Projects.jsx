import { useState, useRef, useEffect } from "react";
import projectData from "../data/projectData.jsx";

const Projects = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [playerAnimation, setPlayerAnimation] = useState('hidden'); // 'hidden', 'entering', 'visible', 'exiting'

  const audioRef = useRef(null);
  const playerRef = useRef(null);

  const filteredSongs = projectData.songs;

  useEffect(() => {
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
      const { currentSongIndex: savedIndex, volume: savedVolume } = JSON.parse(savedState);
      setCurrentSongIndex(savedIndex);
      setVolume(savedVolume);
    }
  }, []);

  useEffect(() => {
    if (filteredSongs.length > 0) {
      const firstSong = filteredSongs[0];
      setSelectedSong(firstSong);
      setCurrentSongIndex(0);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = firstSong.audioFile;
        audioRef.current.play();
      }
    }
  }, []);

  useEffect(() => {
    const state = { currentSongIndex, volume };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
  }, [currentSongIndex, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnd = () => {
        if (repeatMode === 2) {
          audio.currentTime = 0;
          audio.play();
        } else {
          nextSong();
        }
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnd);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnd);
      };
    }
  }, [currentSongIndex, repeatMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowMiniPlayer(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playSong = (song, index) => {
    // Reset animation jika player sedang tampil
    if (selectedSong) {
      setPlayerAnimation('exiting');
      setTimeout(() => {
        setSelectedSong(song);
        setCurrentSongIndex(index);
        setIsPlaying(true);
        setPlayerAnimation('entering');
        setTimeout(() => setPlayerAnimation('visible'), 50);
        
        if (audioRef.current) {
          audioRef.current.src = song.audioFile;
          audioRef.current.play();
        }
      }, 300);
    } else {
      // Jika player belum tampil, langsung show
      setSelectedSong(song);
      setCurrentSongIndex(index);
      setIsPlaying(true);
      setPlayerAnimation('entering');
      setTimeout(() => setPlayerAnimation('visible'), 50);
      
      if (audioRef.current) {
        audioRef.current.src = song.audioFile;
        audioRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % filteredSongs.length;
    }
    const nextSong = filteredSongs[nextIndex];
    playSong(nextSong, nextIndex);
  };

  const prevSong = () => {
    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
      prevIndex = currentSongIndex === 0 ? filteredSongs.length - 1 : currentSongIndex - 1;
    }
    const prevSong = filteredSongs[prevIndex];
    playSong(prevSong, prevIndex);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const closePlayer = () => {
    setPlayerAnimation('exiting');
    setTimeout(() => {
      setSelectedSong(null);
      setIsPlaying(false);
      setPlayerAnimation('hidden');
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }, 300);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 1:
        return "bx bx-repeat text-white";
      case 2:
        return "bx bx-repeat text-white bx-flip-vertical";
      default:
        return "bx bx-repeat text-gray-400";
    }
  };

  // Animation classes based on state
  const getPlayerAnimationClass = () => {
    switch (playerAnimation) {
      case 'entering':
        return 'opacity-0 scale-95';
      case 'visible':
        return 'opacity-100 scale-100';
      case 'exiting':
        return 'opacity-0 scale-95';
      default:
        return 'opacity-0 scale-95';
    }
  };

  const getBackdropAnimationClass = () => {
    switch (playerAnimation) {
      case 'entering':
        return 'opacity-0';
      case 'visible':
        return 'opacity-100';
      case 'exiting':
        return 'opacity-0';
      default:
        return 'opacity-0';
    }
  };

  return (
    <section 
      id="projects" 
      className="min-h-screen pb-32 pt-20 relative"
      data-aos-duration="1000" 
      data-aos="fade-down"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Subtitle */}
        <div className="text-center mb-12" data-aos-delay="600" data-aos="fade-down">
          <h2 className="text-5xl md:text-5xl font-bold text-white mb-4">
            Music Player
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Enjoy your favorite songs with this Spotify-style music player.
          </p>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          {filteredSongs.map((song, index) => (
            <div
              key={index}
              className="group relative bg-transparent rounded-xl overflow-hidden hover:bg-white/5 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 backdrop-blur-sm card-hover-animation"
              onClick={() => playSong(song, index)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/assets/placeholder.jpg';
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 border border-white/30 play-button-animation">
                    <i className="bx bx-play text-white text-2xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="p-4 relative">
                <h3 className="font-semibold text-white text-base mb-1 truncate">{song.title}</h3>
                <p className="text-white/70 text-xs mb-1 truncate">{song.artist}</p>
                <p className="text-white/50 text-xs">{song.album}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Pop-up Player dengan Animasi */}
        {(selectedSong && playerAnimation !== 'hidden') && (
          <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${getBackdropAnimationClass()}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) closePlayer();
            }}
          >
            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-lg"></div>
            
            {/* Player Container */}
            <div 
              ref={playerRef}
              className={`relative bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full border border-white/20 overflow-hidden transform transition-all duration-300 ease-out ${getPlayerAnimationClass()}`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left Side - Album Art */}
                <div className="md:w-2/5 bg-gradient-to-br from-black/30 to-transparent p-8 flex flex-col items-center justify-center border-r border-white/10">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-transparent rounded-xl blur-xl album-glow"></div>
                    <img
                      src={selectedSong.coverImage}
                      alt={selectedSong.title}
                      className="w-60 h-60 rounded-xl object-cover relative z-10 shadow-2xl border border-white/20 album-cover-animation"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* Right Side - Controls */}
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Now Playing</h3>
                    
                    <div className="mb-6 text-center">
                      <h4 className="text-2xl font-bold text-white mb-2 title-animation">{selectedSong.title}</h4>
                      <p className="text-white/70 text-sm mb-1 artist-animation">{selectedSong.artist}</p>
                      <p className="text-white/50 text-xs album-animation">{selectedSong.album}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="relative mb-1">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-100 progress-fill-animation"
                            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6 controls-animation">
                      <button
                        onClick={() => setShuffle(!shuffle)}
                        className={`p-2 rounded-full transition-all duration-200 ${shuffle ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
                      >
                        <i className="bx bx-shuffle text-lg"></i>
                      </button>
                      
                      <button
                        onClick={prevSong}
                        className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <i className="bx bx-skip-previous text-xl"></i>
                      </button>
                      
                      <button
                        onClick={togglePlay}
                        className="bg-white text-black rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 border-2 border-white/30 hover:scale-105 active:scale-95 play-button-animation"
                      >
                        <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'} text-2xl ml-0.5`}></i>
                      </button>
                      
                      <button
                        onClick={nextSong}
                        className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <i className="bx bx-skip-next text-xl"></i>
                      </button>
                      
                      <button
                        onClick={toggleRepeat}
                        className={`p-2 rounded-full transition-all duration-200 ${repeatMode > 0 ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
                      >
                        <i className={getRepeatIcon()}></i>
                      </button>
                    </div>

                    {/* Volume & Like Controls */}
                    <div className="flex items-center justify-between bottom-controls-animation">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'bg-white text-red-500 animate-like' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:scale-110'}`}
                      >
                        <i className={`bx ${isLiked ? 'bxs-heart' : 'bx-heart'} text-lg`}></i>
                      </button>
                      
                      <div className="flex items-center gap-2 w-40">
                        <i className="bx bx-volume-low text-white/60 text-sm"></i>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/20 volume-slider"
                        />
                        <i className="bx bx-volume-full text-white/60 text-sm"></i>
                      </div>
                      
                      <button
                        onClick={closePlayer}
                        className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <i className="bx bx-x text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mini Player dengan Animasi */}
        {showMiniPlayer && selectedSong && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl z-40 min-w-[90%] md:min-w-[500px] shadow-xl mini-player-entrance">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedSong.coverImage}
                      alt={selectedSong.title}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 mini-album-cover"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-xs truncate max-w-[120px] mini-title">{selectedSong.title}</h4>
                    <p className="text-white/70 text-[10px] truncate max-w-[120px] mini-artist">{selectedSong.artist}</p>
                  </div>
                  <button 
                    onClick={() => setIsLiked(!isLiked)} 
                    className={`p-1 rounded ${isLiked ? 'text-red-400 animate-pulse' : 'text-white/70 hover:text-white'}`}
                  >
                    <i className={`bx ${isLiked ? 'bxs-heart' : 'bx-heart'} text-sm`}></i>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={prevSong} className="p-1 rounded bg-white/10 text-white hover:bg-white/20 mini-control">
                    <i className="bx bx-skip-previous text-sm"></i>
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-200 ml-1 mini-play"
                  >
                    <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'} text-xs ml-0.5`}></i>
                  </button>
                  <button onClick={nextSong} className="p-1 rounded bg-white/10 text-white hover:bg-white/20 mini-control">
                    <i className="bx bx-skip-next text-sm"></i>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-48">
                  <span className="text-white/60 text-[10px] min-w-[35px] text-right">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full mini-progress"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-white/60 text-[10px] min-w-[35px]">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Animation for card entrance */
        .card-hover-animation {
          animation: cardEntrance 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Play button animation */
        .play-button-animation {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Player animations */
        .album-cover-animation {
          animation: albumFloat 3s ease-in-out infinite alternate;
        }

        @keyframes albumFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-5px) rotate(1deg);
          }
        }

        .album-glow {
          animation: glowPulse 2s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.6;
          }
        }

        /* Text animations */
        .title-animation {
          animation: slideInDown 0.5s ease-out 0.1s forwards;
          opacity: 0;
          transform: translateY(-10px);
        }

        .artist-animation {
          animation: slideInDown 0.5s ease-out 0.2s forwards;
          opacity: 0;
          transform: translateY(-10px);
        }

        .album-animation {
          animation: slideInDown 0.5s ease-out 0.3s forwards;
          opacity: 0;
          transform: translateY(-10px);
        }

        @keyframes slideInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Controls animation */
        .controls-animation > * {
          animation: popIn 0.4s ease-out forwards;
          opacity: 0;
          transform: scale(0.8);
        }

        .controls-animation > *:nth-child(1) { animation-delay: 0.4s; }
        .controls-animation > *:nth-child(2) { animation-delay: 0.5s; }
        .controls-animation > *:nth-child(3) { animation-delay: 0.6s; }
        .controls-animation > *:nth-child(4) { animation-delay: 0.7s; }
        .controls-animation > *:nth-child(5) { animation-delay: 0.8s; }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Bottom controls animation */
        .bottom-controls-animation > * {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        .bottom-controls-animation > *:nth-child(1) { animation-delay: 0.9s; }
        .bottom-controls-animation > *:nth-child(2) { animation-delay: 1.0s; }
        .bottom-controls-animation > *:nth-child(3) { animation-delay: 1.1s; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Progress fill animation */
        .progress-fill-animation {
          transition: width 0.1s linear;
        }

        /* Like animation */
        .animate-like {
          animation: likePulse 0.6s ease-out;
        }

        @keyframes likePulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Volume slider animation */
        .volume-slider {
          transition: all 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb {
          transition: all 0.2s ease;
        }

        .volume-slider:hover::-webkit-slider-thumb {
          opacity: 1;
          transform: scale(1.2);
        }

        /* Mini player animations */
        .mini-player-entrance {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform: translate(-50%, 100%);
        }

        @keyframes slideUp {
          to {
            transform: translate(-50%, 0);
          }
        }

        .mini-album-cover {
          animation: rotateAlbum 20s linear infinite;
          animation-play-state: ${isPlaying ? 'running' : 'paused'};
        }

        @keyframes rotateAlbum {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .mini-title, .mini-artist {
          animation: textSlide 0.3s ease-out forwards;
          opacity: 0;
          transform: translateX(-10px);
        }

        .mini-title {
          animation-delay: 0.1s;
        }

        .mini-artist {
          animation-delay: 0.2s;
        }

        @keyframes textSlide {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mini-control {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mini-control:hover {
          transform: scale(1.2);
        }

        .mini-play {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mini-play:hover {
          transform: scale(1.1);
        }

        .mini-progress {
          transition: width 0.1s linear;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
        }

        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 2px;
          border-radius: 1px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.3);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          margin-top: -5px;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
        }

        input[type="range"]:hover::-webkit-slider-thumb {
          opacity: 1;
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          height: 2px;
          border-radius: 1px;
        }

        input[type="range"]::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.3);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        .group:hover .border-white/20 {
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
};

export default Projects;