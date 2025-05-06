import React from 'react';
// import { BrowserRouter as Router,  } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import StoriesPage from './pages/StoriesPage';
import ChessGame from './pages/ChessGame';
import StoryDetails from './pages/StoryDetails';
import MappingDetails from './pages/MappingDetails';
import ModulePage from './pages/ModulePage';
import ChaptersPage from './pages/ChaptersPage';
import { AppProvider } from './AppContext'; // <-- import the provider


function App() {
  return (
    <AppProvider>
      <Router>
        <Box>
          <NavBar />
          <Routes>
            <Route path="/" element={<ModulePage />} />
            <Route path="/module/:moduleId" element={<ChaptersPage />} />
            <Route path="/stories/:chapterId" element={<StoriesPage />} />
            <Route path="/chess" element={<ChessGame />} />
            <Route path="/story/:storyId" element={<StoryDetails />} />
            <Route path="/story/:storyId/mapping/:mappingId" element={<MappingDetails />} />
          </Routes>
        </Box>
      </Router>
    </AppProvider>
  );
}

export default App;
