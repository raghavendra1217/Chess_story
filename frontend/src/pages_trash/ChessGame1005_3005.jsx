// import React from 'react';
// import { Box } from '@chakra-ui/react';
// import { Chessboard } from "react-chessboard";

// function ChessGame({ fen }) {
//   return (
//     <Box>
//       <Chessboard 
//         position={fen || "start"}
//         arePiecesDraggable={false}
//         boardWidth={400}
//       />
//     </Box>
//   );
// }

// export default ChessGame;
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js"; // Ensure installed: npm install chess.js
import { Chessboard } from "react-chessboard"; // Ensure installed: npm install react-chessboard
import {
  Box,
  Text,
  VStack,
  Button,
  HStack,
  Divider,
  useColorModeValue,
  Flex,
  Switch,
  Spinner,
} from "@chakra-ui/react"; // Ensure installed: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

// --- Local Storage Key ---
const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';

// --- Helper Functions (Logical - Unchanged) ---
const findKingSquareFn = (gameInstance) => {
    if (!gameInstance) return null;
    const board = gameInstance.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
          return "abcdefgh"[c] + (8 - r);
        }
      }
    }
    return null;
};
const checkIsPromotionFn = (gameInstance, from, to) => {
    if (!from || !to || !gameInstance) return false;
    const piece = gameInstance.get(from);
    if (!piece || piece.type !== 'p') return false;
    const targetRank = to[1];
    const promotionRank = (piece.color === 'w') ? '8' : '1';
    if (targetRank !== promotionRank) return false;
    const moves = gameInstance.moves({ square: from, verbose: true });
    return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
};


// --- Main Component ---
// **** MODIFIED: Accept initialFen prop ****
const ChessGame = ({ initialFen }) => {
  // --- State ---
  const [game, setGame] = useState(null); // Initialize as null, load in useEffect
  // **** MODIFIED: Default to initialFen if provided, otherwise 'start' as placeholder before load ****
  const [fen, setFen] = useState(initialFen || "start");
  const [moveHistory, setMoveHistory] = useState([]);
  const [forwardMoves, setForwardMoves] = useState([]);
  const [playerColor] = useState("white");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [pauseAi, setPauseAi] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [statusText, setStatusText] = useState("Loading Game..."); // Initial status
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
  const [isGameLoading, setIsGameLoading] = useState(true); // Loading state

  // --- Refs (Unchanged) ---
  const moveHistoryRef = useRef(null);

  // --- UI Styling Values (Unchanged) ---
  const pageBg = useColorModeValue("gray.100", "gray.800");
  const boardContainerBg = useColorModeValue("white", "gray.700");
  const historyBg = useColorModeValue("white", "gray.700");
  const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
  const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
  const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
  const boardBorderColor = useColorModeValue("gray.300", "gray.600");
  const historyBorderColor = useColorModeValue("gray.200", "gray.600");
  const statusTextColor = useColorModeValue("gray.800", "gray.50");
  const controlsTextColor = useColorModeValue("gray.700", "gray.200");
  const historyTextColor = useColorModeValue("gray.500", "gray.400");
  const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
  const lastMoveColor = useColorModeValue('black','white');
  const defaultMoveColor = useColorModeValue(undefined, undefined);
  const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
  const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
  const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
  const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
  const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
  const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

  // --- Utility Functions (Unchanged) ---
  const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
  const updateGameStatus = useCallback((currentGame) => {
    if (!currentGame) {
        setStatusText("Game not loaded");
        return;
    }
    let status = "";
    if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
    else if (currentGame.isStalemate()) status = "Stalemate!";
    else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
    else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
    else if (currentGame.isDraw()) status = "Draw by 50-move rule";
    else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
    else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
    setStatusText(status);
  }, []); // No dependencies needed

  // --- Load Game on Mount ---
  // **** MODIFIED: Handles initialFen prop or falls back to localStorage/default ****
  useEffect(() => {
    console.log("Attempting to initialize game state...");
    let loadedGame = null;
    let loadedHistory = [];
    let loadSource = ""; // For logging purposes

    // --- Priority 1: Use initialFen prop if provided ---
    if (initialFen) {
      loadSource = "initialFen prop";
      console.log(`Initializing game from provided initialFen: ${initialFen}`);
      try {
        // Attempt to load the game from the provided FEN
        loadedGame = new Chess(initialFen);

        // Basic validation check (chess.js might not throw for all invalid FENs but might return an unusable state)
        if (!loadedGame || !loadedGame.fen()) {
            throw new Error("Chess.js could not properly parse the provided FEN string.");
        }

        // If FEN is valid, start with an empty history for this specific game instance
        loadedHistory = [];
        console.log("Successfully initialized game from initialFen.");

        // ** Clear localStorage: Starting with a specific FEN means we don't want to load old history **
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          console.log("Cleared previous game history from local storage due to initialFen prop.");
        } catch (storageError) {
          console.error("Failed to clear local storage while handling initialFen:", storageError);
        }

      } catch (fenError) {
        // Handle invalid FEN from prop
        console.error(`**************************************************`);
        console.error(`* ERROR: Invalid initialFen prop provided: "${initialFen}"`);
        console.error(`* Error details: ${fenError.message}`);
        console.error(`* Falling back to the standard initial chess position.`);
        console.error(`**************************************************`);
        loadedGame = new Chess(); // Fallback to default starting position
        loadedHistory = [];
        loadSource = "initialFen error fallback";
      }
    }
    // --- Priority 2: Try loading from localStorage if no initialFen prop ---
    else {
      loadSource = "localStorage attempt";
      console.log("No initialFen prop. Attempting to load game from local storage...");
      try {
        const storedHistoryString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedHistoryString) {
          console.log("Found stored history:", storedHistoryString);
          const parsedHistory = JSON.parse(storedHistoryString); // Potential error point 1

          if (Array.isArray(parsedHistory)) {
            loadedGame = new Chess(); // Start fresh before replaying
            try {
              parsedHistory.forEach(san => loadedGame.move(san)); // Potential error point 2 (invalid SAN)
              console.log("Successfully replayed history from local storage.");
              loadedHistory = parsedHistory; // Use the successfully replayed history
              loadSource = "localStorage success";
            } catch (replayError) {
              console.error("Error replaying stored history:", replayError);
              console.warn("Stored history seems invalid. Clearing storage and starting fresh.");
              localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
              loadedGame = new Chess(); // Reset to new game
              loadedHistory = []; // Reset history
              loadSource = "localStorage replay error fallback";
            }
          } else {
            console.warn("Stored history is not an array. Clearing storage and starting fresh.");
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
            loadedGame = new Chess(); // Start fresh if format is wrong
            loadedHistory = [];
            loadSource = "localStorage format error fallback";
          }
        } else {
          console.log("No stored history found. Starting new game.");
          loadedGame = new Chess(); // Start new game if nothing stored
          loadedHistory = [];
          loadSource = "localStorage empty fallback";
        }
      } catch (parseError) {
        console.error("Error parsing stored history:", parseError);
        console.warn("Clearing potentially corrupted storage and starting fresh.");
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
        loadedGame = new Chess(); // Reset to new game
        loadedHistory = [];
        loadSource = "localStorage parse error fallback";
      }
    }

    // --- Set the final loaded/new game state ---
    setGame(loadedGame);
    setFen(loadedGame.fen()); // Crucial: Set fen state based on the final loadedGame
    setMoveHistory(loadedHistory);
    updateGameStatus(loadedGame);
    setIsGameLoading(false); // Mark loading as complete
    console.log(`Game loading complete. Source: ${loadSource}`);

  // **** MODIFIED: Add initialFen to dependency array ****
  // This ensures the effect re-runs if the prop changes, though usually it's set once on mount.
  }, [initialFen, updateGameStatus]);


  // --- Core Game Logic (Unchanged) ---
  const makeMove = useCallback((move) => {
    if (!game) { console.warn("[makeMove] Attempted move before game loaded."); return false; }
    let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
    try { moveResult = tempGame.move(move); } catch (e) { console.error("Unexpected error during tempGame.move:", e); moveResult = null; }
    if (moveResult) {
      console.log(`[makeMove] Success: ${moveResult.san}`);
      setGame(tempGame); setFen(tempGame.fen());
      setMoveHistory((prev) => {
          const nextHistory = [...prev, moveResult.san];
          try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory)); console.log("Move history saved to local storage."); } catch (storageError) { console.error("Failed to save move history to local storage:", storageError); }
          return nextHistory;
      });
      setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
    } else { console.log("[makeMove] Failed (Illegal Move or Error):", move); success = false; }
    setSelectedSquare(null); setHighlightedSquares([]); return success;
  }, [game, updateGameStatus, aiEnabled]);


  // --- react-chessboard Callbacks (Logical - Unchanged) ---
  const isDraggablePiece = useCallback(({ piece }) => {
    if (!game || game.isGameOver() || isGameLoading) return false;
    const pieceColor = piece[0];
    if (aiEnabled) { return game.turn() === playerColor.charAt(0) && pieceColor === playerColor.charAt(0); }
    else { return game.turn() === pieceColor; }
  }, [game, playerColor, aiEnabled, isGameLoading]);
  const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
    if (!game || isGameLoading) return false;
    if (!piece || piece[1].toLowerCase() !== 'p') return false;
    return checkIsPromotion(sourceSquare, targetSquare);
  }, [checkIsPromotion, game, isGameLoading]);
  const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
    if (!game || isGameLoading) return false;
    if (!piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
    const promotionPiece = piece[1].toLowerCase(); const fromSq = promoteFromSquare ?? pendingManualPromotion?.from; const toSq = promoteToSquare ?? pendingManualPromotion?.to;
    if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
    const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
  }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);
  const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
    if (!game || isGameLoading) return false;
    const pieceColor = pieceString[0]; if (game.isGameOver() || (aiEnabled && game.turn() !== playerColor.charAt(0)) || (!aiEnabled && game.turn() !== pieceColor)) { return false; }
    const isPromo = checkIsPromotion(sourceSquare, targetSquare); if (isPromo) { return true; } else { const success = makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }); return success; }
  }, [game, playerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);
  const onSquareClick = useCallback((square) => {
    if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return; if (aiEnabled && game.turn() !== playerColor.charAt(0)) return;
    if (!selectedSquare) { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); }
    } else { if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; } if (highlightedSquares.includes(square)) { const isPromo = checkIsPromotion(selectedSquare, square); if (isPromo) { setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true); setSelectedSquare(null); setHighlightedSquares([]); return; } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); } } else { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); } } }
  }, [game, selectedSquare, highlightedSquares, playerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


  // --- Control Button Functions (Unchanged) ---
  const resetGame = useCallback(() => {
    console.log("Resetting game.");
    const newGame = new Chess(); setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]); setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
    try { localStorage.removeItem(LOCAL_STORAGE_KEY); console.log("Cleared local storage on reset."); } catch (e) { console.error("Failed to clear local storage on reset:", e); }
  }, [updateGameStatus]);
  const undoMove = useCallback(() => {
    if (!game || isGameLoading || isAiThinking) return; const movesToUndo = aiEnabled ? 2 : 1; if (moveHistory.length < movesToUndo || game.isGameOver()) return; console.log(`[Undo] Undoing last ${movesToUndo} move(s).`); const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo); const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo); setForwardMoves((prev) => [...undoneMoves, ...prev]); const newGame = new Chess();
    try { newHistory.forEach((san) => newGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
    setGame(newGame); setFen(newGame.fen()); setMoveHistory(newHistory);
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory)); console.log("Updated history saved to local storage after undo."); } catch (storageError) { console.error("Failed to save history to local storage after undo:", storageError); }
    if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(newGame); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
  }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking]);
  const forwardMove = useCallback(() => {
    if (!game || isGameLoading || isAiThinking) return; const movesToRedo = aiEnabled ? 2 : 1; if (forwardMoves.length < movesToRedo || game.isGameOver()) return; console.log(`[Redo] Redoing ${movesToRedo} move(s).`); const redoSANs = forwardMoves.slice(0, movesToRedo); const remainingForwardMoves = forwardMoves.slice(movesToRedo); const tempGame = new Chess(game.fen());
    try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", redoSANs, e); setForwardMoves([]); return; }
    const nextHistory = [...moveHistory, ...redoSANs]; setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory)); console.log("Updated history saved to local storage after redo."); } catch (storageError) { console.error("Failed to save history to local storage after redo:", storageError); }
    setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
  }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking]);


  // --- AI Logic (Unchanged) ---
  const fetchBestMove = useCallback(async (currentFen) => {
    const depth = 5; const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`; console.log("[fetchBestMove] Fetching AI move...");
    try { const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`); const data = await res.json(); if (data.success && data.bestmove) { const bestMoveString = data.bestmove.split(" ")[1]; const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4); const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined; console.log("[fetchBestMove] AI Move received:", { from, to, promotion }); return { from, to, promotion }; } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; } } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
  }, []);
  useEffect(() => {
    if (!game || game.isGameOver() || isGameLoading) return; const isAITurn = game.turn() !== playerColor.charAt(0); let timeoutId = null;
    if (aiEnabled && !pauseAi && isAITurn) {
      const currentFen = game.fen(); console.log("[AI Effect] AI turn detected. Scheduling fetch..."); setIsAiThinking(true);
      timeoutId = setTimeout(async () => {
        const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
        if (stillValidToFetch) {
          console.log("[AI Effect] Executing fetch for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
          const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
          if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); } else { console.log("[AI Effect] AI move aborted before applying (state changed during fetch or fetch failed)."); }
        } else { console.log("[AI Effect] AI move fetch aborted (state changed before timeout execution)."); }
        setIsAiThinking(false);
      }, 1000);
    } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking indicator."); setIsAiThinking(false); }
    return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI move timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== playerColor.charAt(0)) { setIsAiThinking(false); } } };
  }, [fen, game, aiEnabled, pauseAi, playerColor, fetchBestMove, makeMove, isGameLoading]);


  // --- Auto-scroll Move History (Unchanged) ---
  useEffect(() => {
    if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
  }, [moveHistory]);


  // --- Helper to generate custom square styles (Unchanged) ---
  const getCustomSquareStyles = useCallback(() => {
    const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
    highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
    if (selectedSquare) { styles[selectedSquare] = { ...(styles[selectedSquare] ?? {}), backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
    if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
  }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


  // --- Render (Unchanged - relies on the `fen` state which is set correctly by the useEffect) ---
  return (
    <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

      {/* --- Chessboard Area --- */}
      <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={3} px={1}>
          <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
            {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
            <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
              {statusText}
            </Text>
          </Flex>
          <HStack spacing={3} align="center" flexShrink={0}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
              {aiEnabled ? "vs AI (Black)" : "Pass & Play"}
            </Text>
            <Switch
              id="ai-switch" colorScheme="teal" isChecked={aiEnabled}
              onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }}
              isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"
            />
          </HStack>
        </Flex>

        {/* The Chessboard Component */}
        {isGameLoading ? (
            <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
                <Text color={statusTextColor}>Loading Board...</Text>
            </Box>
        ) : (
            <Chessboard
              id="PlayerVsAiBoard"
              position={fen} // This uses the `fen` state variable, correctly set by useEffect
              isDraggablePiece={isDraggablePiece}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              onPromotionCheck={onPromotionCheck}
              onPromotionPieceSelect={handlePromotionPieceSelect}
              showPromotionDialog={promotionDialogOpen}
              promotionToSquare={pendingManualPromotion?.to ?? null}
              promotionDialogVariant="modal"
              boardOrientation={playerColor}
              boardWidth={420}
              customSquareStyles={getCustomSquareStyles()}
              customDarkSquareStyle={customDarkSquareStyle}
              customLightSquareStyle={customLightSquareStyle}
              snapToCursor={true}
              animationDuration={150}
            />
        )}
      </Box>

      {/* --- Sidebar Area (Unchanged) --- */}
      <VStack align="stretch" spacing={5} width="220px" pt={1}>
        {/* Controls Section */}
        <VStack align="stretch" spacing={3}>
             <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
             <HStack spacing={3}>
               <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
               <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
             </HStack>
             <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
        </VStack>
        <Divider />

        {/* Move History Section */}
         <VStack align="stretch" spacing={2}>
             <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
            <Box
              ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
              sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
            >
              {isGameLoading ? (
                  <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
              ) : moveHistory.length === 0 ? (
                <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
               ) : (
                 <VStack spacing={1} align="stretch">
                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
                        const moveNumber = i + 1; const whiteMoveIndex = i * 2; const blackMoveIndex = i * 2 + 1; const isLastWhite = whiteMoveIndex === moveHistory.length - 1; const isLastBlack = blackMoveIndex === moveHistory.length - 1;
                        return (
                          <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
                             <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>
                             <Text minW="55px" px={1} fontWeight={isLastWhite ? 'extrabold': 'normal'} color={isLastWhite ? lastMoveColor : defaultMoveColor} title={`White move ${moveNumber}: ${moveHistory[whiteMoveIndex]}`}> {moveHistory[whiteMoveIndex] ?? ""} </Text>
                             <Text minW="55px" px={1} fontWeight={isLastBlack ? 'extrabold': 'normal'} color={isLastBlack ? lastMoveColor : defaultMoveColor} visibility={moveHistory[blackMoveIndex] ? 'visible' : 'hidden'} title={moveHistory[blackMoveIndex] ? `Black move ${moveNumber}: ${moveHistory[blackMoveIndex]}` : ''} > {moveHistory[blackMoveIndex] ?? ""} </Text>
                          </Flex>
                        )
                    })}
                 </VStack>
              )}
            </Box>
         </VStack>
      </VStack>
    </HStack>
  );
};

export default ChessGame;