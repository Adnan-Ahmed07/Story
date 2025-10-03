import { useState } from 'react';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import { Heart, PenLine, Library } from 'lucide-react';

type View = 'home' | 'write' | 'read' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStorySubmitted = () => {
    setCurrentView('read');
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentView('detail');
  };

  const handleBackToStories = () => {
    setCurrentView('read');
    setSelectedStoryId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition"
            >
              <Heart className="w-8 h-8" fill="currentColor" />
              <span className="text-2xl font-bold">LoveStories</span>
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('read')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentView === 'read' || currentView === 'detail'
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Library className="w-5 h-5" />
                <span className="hidden sm:inline">Read Stories</span>
              </button>

              <button
                onClick={() => setCurrentView('write')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentView === 'write'
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                <PenLine className="w-5 h-5" />
                <span className="hidden sm:inline">Share Your Story</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentView === 'home' && (
          <div className="text-center">
            <div className="mb-8">
              <Heart className="w-24 h-24 text-rose-500 mx-auto mb-6" fill="currentColor" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                Share Your Love Story
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A place where hearts connect through beautiful love stories. Share your journey,
                read inspiring tales, and celebrate the magic of love together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button
                onClick={() => setCurrentView('write')}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-rose-600 hover:to-pink-700 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <PenLine className="w-5 h-5" />
                Share Your Story
              </button>

              <button
                onClick={() => setCurrentView('read')}
                className="bg-white text-rose-600 font-semibold py-4 px-8 rounded-lg hover:bg-rose-50 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-rose-200"
              >
                <Library className="w-5 h-5" />
                Read Love Stories
              </button>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <PenLine className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Share</h3>
                <p className="text-gray-600">
                  Tell your unique love story and inspire others with your journey
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Connect</h3>
                <p className="text-gray-600">
                  Read heartwarming stories from people around the world
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Library className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Engage</h3>
                <p className="text-gray-600">
                  Leave comments and celebrate love with the community
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'write' && <StoryForm onSuccess={handleStorySubmitted} />}

        {currentView === 'read' && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Love Stories Collection</h2>
              <p className="text-gray-600 text-lg">
                Discover beautiful tales of love, romance, and connection
              </p>
            </div>
            <StoryList onStoryClick={handleStoryClick} refreshTrigger={refreshTrigger} />
          </div>
        )}

        {currentView === 'detail' && selectedStoryId && (
          <StoryDetail storyId={selectedStoryId} onBack={handleBackToStories} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-rose-500" fill="currentColor" /> for love story enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
