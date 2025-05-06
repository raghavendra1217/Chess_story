// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Chess } from "chess.js";
// import { Chessboard } from "react-chessboard";
// import {
//   Box,
//   Text,
//   VStack,
//   Button,
//   HStack,
//   Divider,
//   useColorModeValue,
//   Flex,
//   Switch,
//   Spinner,
// } from "@chakra-ui/react";

// // --- Local Storage Key ---
// const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';
// // Helper function to get the appropriate storage key based on FEN
// const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;


// // --- Helper Functions (Logical - Unchanged) ---
// const findKingSquareFn = (gameInstance) => {
//     if (!gameInstance) return null;
//     const board = gameInstance.board();
//     for (let r = 0; r < 8; r++) {
//       for (let c = 0; c < 8; c++) {
//         const piece = board[r][c];
//         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
//           return "abcdefgh"[c] + (8 - r);
//         }
//       }
//     }
//     return null;
// };
// const checkIsPromotionFn = (gameInstance, from, to) => {
//     if (!from || !to || !gameInstance) return false;
//     const piece = gameInstance.get(from);
//     if (!piece || piece.type !== 'p') return false;
//     const targetRank = to[1];
//     const promotionRank = (piece.color === 'w') ? '8' : '1';
//     if (targetRank !== promotionRank) return false;
//     const moves = gameInstance.moves({ square: from, verbose: true });
//     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// };


// // --- Main Component ---
// const ChessGame = ({ initialFen }) => {
//   // --- State ---
//   const [game, setGame] = useState(null);
//   const [fen, setFen] = useState(initialFen || "start");
//   const [moveHistory, setMoveHistory] = useState([]); // Stores moves sequentially: [w1, b1, w2, b2, ...] OR [b1, w1, b2, w2, ...] if black starts
//   const [forwardMoves, setForwardMoves] = useState([]);
//   const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Determined once on load
//   const [aiEnabled, setAiEnabled] = useState(true);
//   const [pauseAi, setPauseAi] = useState(false);
//   const [isAiThinking, setIsAiThinking] = useState(false);
//   const [selectedSquare, setSelectedSquare] = useState(null);
//   const [highlightedSquares, setHighlightedSquares] = useState([]);
//   const [statusText, setStatusText] = useState("Loading Game...");
//   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
//   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
//   const [isGameLoading, setIsGameLoading] = useState(true);
//   // **** ADDED: State to track if the game started with black to move ****
//   const [startedWithBlackMove, setStartedWithBlackMove] = useState(false);

//   // --- Refs (Unchanged) ---
//   const moveHistoryRef = useRef(null);

//   // --- UI Styling Values ---
//   // const pageBg = useColorModeValue("gray.100", "gray.800");
//   const boardContainerBg = useColorModeValue("white", "gray.700");
//   const historyBg = useColorModeValue("white", "gray.700");
//   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
//   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
//   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
//   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
//   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
//   const statusTextColor = useColorModeValue("gray.800", "gray.50");
//   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
//   const historyTextColor = useColorModeValue("gray.500", "gray.400");
//   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
//   const lastMoveColor = useColorModeValue('black','white');
//   const defaultMoveColor = useColorModeValue("gray.700", "gray.300");
//   const placeholderMoveColor = useColorModeValue("gray.500", "gray.400");
//   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
//   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
//   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
//   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
//   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
//   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

//   const [boardWidth, setBoardWidth] = useState(420);  // default 500
//   const [uiSizes, setUiSizes] = useState({
//     sidebarWidth: 220,
//     mhhieght:"350x",
//     buttonWidth: "100%",
//     moveTextFontSize: "md",
//     controlTextFontSize: "md",
// });



//   // --- Utility Functions (Unchanged) ---
//   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
//   const updateGameStatus = useCallback((currentGame) => {
//     if (!currentGame) { setStatusText("Game not loaded"); return; }
//     let status = "";
//     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
//     else if (currentGame.isStalemate()) status = "Stalemate!";
//     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
//     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
//     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
//     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
//     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
//     setStatusText(status);
//   }, []);

//   const [windowSize, setWindowSize] = useState({
//     innerWidth: window.innerWidth,
//     innerHeight: window.innerHeight,
// });

// useEffect(() => {
//     const handleResize = () => {
//         const newSize = {
//             innerWidth: window.innerWidth,
//             innerHeight: window.innerHeight,
//         };

//         setWindowSize(newSize);

//         console.log("Window resized:");
//         console.table(newSize);

//         let bw=newSize.innerWidth/2;
//         while (bw>newSize.innerHeight/1.4 ){ 
//               bw=bw-20;
//         }
//         setBoardWidth(bw);

//     };


//     window.addEventListener("resize", handleResize);

//     // Initial call
//     handleResize();

//     return () => {
//         window.removeEventListener("resize", handleResize);
//     };
// }, []);


//   // --- Load Game on Mount (Sets fixed player color AND if black started) ---
//   useEffect(() => {
//     console.log("Attempting to initialize game state...");
//     let loadedGame = null;
//     let loadedHistory = [];
//     let loadSource = "";
//     const storageKey = getStorageKey(initialFen);
//     let blackToMoveInitially = false; // Flag to track initial turn

//     // Logic to load game from initialFen or localStorage (UNCHANGED logic, just added flag setting)
//     if (initialFen) {
//       loadSource = "initialFen prop";
//       console.log(`Initializing game from provided initialFen: ${initialFen}`);
//       try {
//         loadedGame = new Chess(initialFen);
//         if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
//         blackToMoveInitially = loadedGame.turn() === 'b'; // Check initial turn from FEN
//         loadedHistory = [];
//         console.log("Successfully initialized game from initialFen.");
//         try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
//       } catch (fenError) {
//         console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
//         loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
//         blackToMoveInitially = false; // Default start is White's move
//       }
//     } else {
//       loadSource = "localStorage attempt";
//       console.log("No initialFen. Attempting load from storage...");
//        blackToMoveInitially = false; // Assume White starts if loading history (or new game)
//       try {
//         const storedHistoryString = localStorage.getItem(storageKey);
//         if (storedHistoryString) {
//           const parsedHistory = JSON.parse(storedHistoryString);
//           if (Array.isArray(parsedHistory)) {
//             loadedGame = new Chess(); // Start fresh
//             try {
//               // **** Important: If replaying history, the initial state is always White's move ****
//               // The current turn will reflect the state *after* replay.
//               parsedHistory.forEach(san => loadedGame.move(san));
//               console.log("Successfully replayed history from storage.");
//               loadedHistory = parsedHistory; loadSource = "localStorage success";
//             } catch (replayError) {
//               console.error("Error replaying stored history:", replayError);
//               localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage replay error";
//             }
//           } else { /* Handle non-array stored data */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage format error"; }
//         } else { /* No stored history */ loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage empty"; }
//       } catch (parseError) { /* Handle JSON parse error */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage parse error"; }
//     }

//     setGame(loadedGame);
//     setFen(loadedGame.fen());
//     setMoveHistory(loadedHistory);
//     updateGameStatus(loadedGame);

//     // Set human player color based on *current* turn after load/replay
//     const currentTurn = loadedGame.turn();
//     const playerColor = currentTurn === 'w' ? 'white' : 'black';
//     setHumanPlayerColor(playerColor); // Fixed after this point

//     // **** Set the flag indicating if the game *started* with Black to move ****
//     setStartedWithBlackMove(blackToMoveInitially);
//     console.log(`Game loaded. Current Turn: ${currentTurn}. Human Player controls: ${playerColor}. Started w/ Black move: ${blackToMoveInitially}`);

//     setIsGameLoading(false);
//     console.log(`Game loading complete. Source: ${loadSource}`);
//   }, [initialFen, updateGameStatus]);


//   // --- Core Game Logic (Saves history normally) ---
//   // (makeMove logic is UNCHANGED from previous version)
//   const makeMove = useCallback((move) => {
//     if (!game) return false;
//     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
//     try { moveResult = tempGame.move(move); } catch (e) { console.error("Error making move:", e); moveResult = null; }
//     if (moveResult) {
//       console.log(`[makeMove] Success: ${moveResult.san}`);
//       setGame(tempGame); setFen(tempGame.fen());
//       setMoveHistory((prev) => {
//           const nextHistory = [...prev, moveResult.san]; // Append normally
//           const storageKey = getStorageKey(initialFen);
//           try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved (${storageKey})`); } catch (e) { console.error("Failed to save history:", e); }
//           return nextHistory; // Return standard sequence
//       });
//       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
//     } else { console.log("[makeMove] Failed (Illegal Move/Error):", move); success = false; }
//     setSelectedSquare(null); setHighlightedSquares([]); return success;
//   }, [game, updateGameStatus, aiEnabled, initialFen]);


//   // --- react-chessboard Callbacks (Use fixed humanPlayerColor) ---
//   // (isDraggablePiece, onPromotionCheck, handlePromotionPieceSelect, onPieceDrop, onSquareClick are UNCHANGED from previous version)
//     const isDraggablePiece = useCallback(({ piece }) => {
//     if (!game || game.isGameOver() || isGameLoading) return false;
//     const pieceColor = piece[0];
//     const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';
//     if (aiEnabled) {
//         const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
//         const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
//         return isHumanTurn && isHumanPiece;
//     } else { return game.turn() === pieceColor; }
//   }, [game, aiEnabled, isGameLoading, humanPlayerColor]);

//   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
//     if (!game || isGameLoading || !piece || piece[1].toLowerCase() !== 'p') return false;
//     return checkIsPromotion(sourceSquare, targetSquare);
//   }, [checkIsPromotion, game, isGameLoading]);

//   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
//     if (!game || isGameLoading || !piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
//     const promotionPiece = piece[1].toLowerCase();
//     const fromSq = promoteFromSquare ?? pendingManualPromotion?.from;
//     const toSq = promoteToSquare ?? pendingManualPromotion?.to;
//     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
//     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece });
//     if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
//   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

//   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
//     if (!game || isGameLoading || game.isGameOver()) return false;
//     const pieceColor = pieceString[0];
//     const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
//     if (aiEnabled && !isHumanTurn) return false;
//     if (!aiEnabled && game.turn() !== pieceColor) return false;
//     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
//     if (isPromo) return true;
//     else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
//   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

//   const onSquareClick = useCallback((square) => {
//     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;
//     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return;

//     if (!selectedSquare) {
//         const piece = game.get(square);
//         if (piece && piece.color === game.turn()) {
//             const moves = game.moves({ square: square, verbose: true });
//             if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
//             else { setSelectedSquare(null); setHighlightedSquares([]); }
//         } else { setSelectedSquare(null); setHighlightedSquares([]); }
//     } else {
//         if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; }
//         if (highlightedSquares.includes(square)) {
//             const isPromo = checkIsPromotion(selectedSquare, square);
//             if (isPromo) {
//                 setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true);
//                 setSelectedSquare(null); setHighlightedSquares([]);
//             } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); }
//         } else {
//             const piece = game.get(square);
//             if (piece && piece.color === game.turn()) {
//                 const moves = game.moves({ square: square, verbose: true });
//                 if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
//                 else { setSelectedSquare(null); setHighlightedSquares([]); }
//             } else { setSelectedSquare(null); setHighlightedSquares([]); }
//         }
//     }
//   }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


//   // --- Control Button Functions (Use fixed humanPlayerColor, reset added state) ---
//   const resetGame = useCallback(() => {
//     console.log("Resetting game.");
//     const newGame = initialFen ? new Chess(initialFen) : new Chess();
//     const initialTurn = newGame.turn();
//     const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
//     const blackStarted = initialTurn === 'b'; // Check if reset state starts with black
//     console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed). Started w/ Black: ${blackStarted}`);
//     setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
//     setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
//     setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
//     // **** Reset the startedWithBlackMove flag based on the reset state ****
//     setStartedWithBlackMove(blackStarted);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
//   }, [updateGameStatus, initialFen]); // humanPlayerColor removed as dependency, it's fixed

//   const undoMove = useCallback(() => {
//     // Logic for undoing moves remains the same
//     if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
//     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
//     if (moveHistory.length < movesToUndo || game.isGameOver()) return;
//     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
//     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
//     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
//     setForwardMoves((prev) => [...undoneMoves, ...prev]);
//     // Recreate game state - `startedWithBlackMove` remains unchanged as it refers to the *initial* FEN
//     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
//     try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
//     console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
//     setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
//     if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
//     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
//     // No need to change startedWithBlackMove here
//   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]); // Added startedWithBlackMove dependency for logging

//   const forwardMove = useCallback(() => {
//     // Logic for redoing moves remains the same
//     if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
//     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
//     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
//     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
//     const redoSANs = forwardMoves.slice(0, movesToRedo);
//     const remainingForwardMoves = forwardMoves.slice(movesToRedo);
//     const tempGame = new Chess(game.fen());
//     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", e); setForwardMoves([]); return; }
//     const nextHistory = [...moveHistory, ...redoSANs];
//     console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
//     setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
//     setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
//     if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
//     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
//      // No need to change startedWithBlackMove here
//   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]); // Added startedWithBlackMove dependency for logging


//   // --- AI Logic (Uses fixed humanPlayerColor) ---
//   // (fetchBestMove, useEffect are UNCHANGED from previous version)
//     const fetchBestMove = useCallback(async (currentFen) => {
//     const depth = 4;
//     const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
//     console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
//     try {
//         const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`);
//         const data = await res.json();
//         if (data.success && data.bestmove && typeof data.bestmove === 'string') {
//             const bestMoveString = data.bestmove.split(" ")[1];
//             if (bestMoveString && bestMoveString.length >= 4) {
//               const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4);
//               const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
//               return { from, to, promotion };
//             } else { console.error("[fetchBestMove] Invalid bestmove format:", data.bestmove); return null; }
//         } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; }
//     } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
//   }, []);

//   useEffect(() => {
//     if (!game || game.isGameOver() || isGameLoading) return;
//     const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
//     let timeoutId = null;
//     if (aiEnabled && !pauseAi && isAITurn) {
//       const currentFen = game.fen(); console.log(`[AI Effect] AI turn (${game.turn()}). Scheduling fetch...`);
//       setIsAiThinking(true);
//       timeoutId = setTimeout(async () => {
//         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
//         if (stillValidToFetch) {
//           console.log("[AI Effect] Fetching for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
//           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
//           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); }
//           else { console.log("[AI Effect] AI move aborted."); }
//         } else { console.log("[AI Effect] AI fetch aborted."); }
//         setIsAiThinking(false);
//       }, 1000);
//     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking."); setIsAiThinking(false); }
//     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) setIsAiThinking(false); } };
//   }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


//   // --- Auto-scroll Move History (Unchanged) ---
//   useEffect(() => {
//     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
//   }, [moveHistory]);


//   // --- Helper to generate custom square styles (Unchanged) ---
//   const getCustomSquareStyles = useCallback(() => {
//     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
//     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
//     if (selectedSquare) { styles[selectedSquare] = { backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
//     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
//   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


//   // --- Render (Uses fixed boardOrientation, MODIFIED History Display) ---
//   return (
//     <HStack align="start" spacing={6} p={5}>

//       {/* --- Chessboard Area (Uses fixed orientation) --- */}
//       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
//         {/* Header */}
//         <Flex justify="space-between" align="center" mb={3} px={1}>
//           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
//             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
//             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
//               {isGameLoading ? "Loading Game..." : statusText}
//             </Text>
//           </Flex>
//           <HStack spacing={3} align="center" flexShrink={0}>
//             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
//               {aiEnabled ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})` : "Pass & Play"}
//             </Text>
//             <Switch id="ai-switch" colorScheme="teal" isChecked={aiEnabled} onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }} isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"/>
//           </HStack>
//         </Flex>

//         {/* The Chessboard Component */}
//         {isGameLoading ? (
//             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
//                 <Text color={statusTextColor}>Loading Board...</Text>
//             </Box>
//         ) : (
//             <Chessboard id="PlayerVsAiBoard" position={fen} isDraggablePiece={isDraggablePiece} onPieceDrop={onPieceDrop} onSquareClick={onSquareClick} onPromotionCheck={onPromotionCheck} onPromotionPieceSelect={handlePromotionPieceSelect} showPromotionDialog={promotionDialogOpen} promotionToSquare={pendingManualPromotion?.to ?? null} promotionDialogVariant="modal"
//               boardOrientation={humanPlayerColor} boardWidth={boardWidth} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
//         )}
//       </Box>

//       {/* --- Sidebar Area (MODIFIED History Display Logic & Height) --- */}
//       <VStack align="stretch" spacing={5} width="220px" pt={1}>
//         {/* Controls Section */}

//         <Divider />

//         {/* Move History Section (MODIFIED DISPLAY LOGIC & HEIGHT) */}
//          <VStack align="stretch" spacing={2}>
//              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
//             <Box
//               ref={moveHistoryRef}
//               h={Math.min(windowSize.innerHeight/2,windowSize.innerWidth/3)} // Reduced height
//               w={Math.min(windowSize.innerWidth/4, windowSize.innerHeight/3.7)}
//             //   const [uiSizes, setUiSizes] = useState({
//             //     sidebarWidth: 220,
//             //     mhhieght:"350x",
//             //     buttonWidth: "100%",
//             //     moveTextFontSize: "md",
//             //     controlTextFontSize: "md",
//             // });
              
//               // overflowY="auto"
//               bg={historyBg} p={3} borderRadius="md" boxShadow="md"  border="1px" borderColor={historyBorderColor}
//               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
//             >
//               {isGameLoading ? (
//                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
//               ) : // **** DISPLAY LOGIC REVISED ****
//                 (moveHistory.length === 0 && !startedWithBlackMove) ? (
//                   // Case 1: No moves AND White started -> "No moves yet"
//                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
//                 ) : (
//                 // Case 2: Moves exist OR Black started -> Render list
//                  <VStack spacing={1} align="stretch">
//                     {(() => { // Immediately invoked function to generate pairs
//                         const pairs = [];
//                         if (startedWithBlackMove) {
//                             // **** Logic for Black starting ****
//                             const blackFirstMove = moveHistory.length > 0 ? moveHistory[0] : undefined;
//                             pairs.push({
//                                 moveNumber: 1,
//                                 white: "...", // Placeholder
//                                 black: blackFirstMove,
//                                 isWhiteLast: false,
//                                 isBlackLast: moveHistory.length === 1,
//                                 usePlaceholderStyle: true,
//                             });
//                             // Subsequent moves (w1, b2), (w2, b3), ...
//                             for (let i = 1; i < moveHistory.length; i += 2) {
//                                 pairs.push({
//                                     moveNumber: Math.floor(i / 2) + 2, // Move # 2, 3, ...
//                                     white: moveHistory[i],      // White's move (w1, w2...) at index 1, 3...
//                                     black: moveHistory[i + 1],  // Black's move (b2, b3...) at index 2, 4...
//                                     isWhiteLast: i === moveHistory.length - 1,
//                                     isBlackLast: (i + 1) === moveHistory.length - 1,
//                                     usePlaceholderStyle: false,
//                                 });
//                             }
//                         } else {
//                             // **** Logic for White starting (Standard) ****
//                             for (let i = 0; i < moveHistory.length; i += 2) {
//                                 pairs.push({
//                                     moveNumber: (i / 2) + 1,
//                                     white: moveHistory[i],      // White's move (w1, w2...) at index 0, 2...
//                                     black: moveHistory[i + 1],  // Black's move (b1, b2...) at index 1, 3...
//                                     isWhiteLast: i === moveHistory.length - 1,
//                                     isBlackLast: (i + 1) === moveHistory.length - 1,
//                                     usePlaceholderStyle: false,
//                                 });
//                             }
//                         }
//                         // Filter out potential empty pairs if history length is odd and white started
//                         // (No, the loop condition handles this)

//                         // If black started and no moves yet, pairs will just have the placeholder row
//                         if (startedWithBlackMove && moveHistory.length === 0 && pairs.length === 0) {
//                            pairs.push({ moveNumber: 1, white: "...", black: undefined, isWhiteLast: false, isBlackLast: false, usePlaceholderStyle: true });
//                         }

//                         // Now map the generated pairs
//                         return pairs.map((item) => (
//                             <Flex key={item.moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
//                                 {/* Move Number */}
//                                 <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{item.moveNumber}.</Text>

//                                 {/* White Move Slot (or Placeholder) */}
//                                 <Text
//                                     minW="55px" px={1}
//                                     fontWeight={item.isWhiteLast ? 'extrabold': 'normal'}
//                                     color={item.usePlaceholderStyle ? placeholderMoveColor : (item.isWhiteLast ? lastMoveColor : defaultMoveColor)}
//                                     title={item.usePlaceholderStyle ? "White move 1: (skipped)" : (item.white ? `White move ${item.moveNumber}: ${item.white}`: '')}
//                                     visibility={item.white ? 'visible' : 'hidden'}
//                                 >
//                                     {item.white ?? ""}
//                                 </Text>

//                                 {/* Black Move Slot */}
//                                 <Text
//                                     minW="55px" px={1}
//                                     fontWeight={item.isBlackLast ? 'extrabold': 'normal'}
//                                     color={item.isBlackLast ? lastMoveColor : defaultMoveColor}
//                                     visibility={item.black ? 'visible' : 'hidden'}
//                                     title={item.black ? `Black move ${item.moveNumber}: ${item.black}`: ''}
//                                 >
//                                     {item.black ?? ""}
//                                 </Text>
//                             </Flex>
//                         ));
//                     })()}
//                  </VStack>
//               )}
//             </Box>
//          </VStack>
//          <VStack align="stretch" spacing={3}>
//              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
//              <HStack spacing={3}>
//                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
//                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
//              </HStack>
//              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
//         </VStack>

//       </VStack>
//     </HStack>
//   );
// };

// export default ChessGame;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
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
} from "@chakra-ui/react";

// --- Local Storage Key ---
const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';
const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;

// --- Sound File Paths (relative to public folder) ---
const soundFiles = {
    move: '/sounds/move.mp3',    // Example path - REPLACE with your actual file
    capture: '/sounds/capture.mp3',   // Example path - REPLACE with your actual file
    check: '/sounds/check.mp3',  // Example path - REPLACE with your actual file
    castle: '/sounds/castle.mp3',     // Example path - REPLACE with your actual file
    promote: '/sounds/promote.mp3',   // Example path - REPLACE with your actual file
    gameEnd: '/sounds/game-end.mp3' // Example path - REPLACE with your actual file (for checkmate/stalemate/draw)
};

// --- Sound Playing Utility ---
const playSound = (soundType) => {
  const audioSrc = soundFiles[soundType];
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(e => {
      // Autoplay restrictions might prevent playing without user interaction first.
      // Log the error but don't crash the app.
      console.error("Error playing sound:", soundType, e);
    });
  } else {
    console.warn("Sound type not found:", soundType);
  }
};


// --- Helper Functions (Logical - Unchanged) ---
const findKingSquareFn = (gameInstance) => {
    // ... (keep existing implementation)
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
    // ... (keep existing implementation)
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
const ChessGame = ({ initialFen }) => {
  // --- State ---
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState(initialFen || "start");
  const [moveHistory, setMoveHistory] = useState([]);
  const [forwardMoves, setForwardMoves] = useState([]);
  const [humanPlayerColor, setHumanPlayerColor] = useState("white");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [pauseAi, setPauseAi] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [statusText, setStatusText] = useState("Loading Game...");
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
  const [isGameLoading, setIsGameLoading] = useState(true);
  const [startedWithBlackMove, setStartedWithBlackMove] = useState(false);

  // --- Refs (Unchanged) ---
  const moveHistoryRef = useRef(null);

  // --- UI Styling Values ---
  // ... (keep existing styles)
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
  const defaultMoveColor = useColorModeValue("gray.700", "gray.300");
  const placeholderMoveColor = useColorModeValue("gray.500", "gray.400");
  const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
  const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
  const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
  const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
  const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
  const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );
  const [boardWidth, setBoardWidth] = useState(420);
  const [uiSizes, setUiSizes] = useState({
    sidebarWidth: 220,
    mhhieght:"350x",
    buttonWidth: "100%",
    moveTextFontSize: "md",
    controlTextFontSize: "md",
  });


  // --- Utility Functions (Unchanged) ---
  const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
  const updateGameStatus = useCallback((currentGame) => {
    // ... (keep existing implementation)
    if (!currentGame) { setStatusText("Game not loaded"); return; }
    let status = "";
    if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
    else if (currentGame.isStalemate()) status = "Stalemate!";
    else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
    else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
    else if (currentGame.isDraw()) status = "Draw by 50-move rule";
    else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
    else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
    setStatusText(status);
  }, []);

  // --- Window Resize Effect ---
  const [windowSize, setWindowSize] = useState({ innerWidth: window.innerWidth, innerHeight: window.innerHeight});
  useEffect(() => {
    // ... (keep existing implementation)
     const handleResize = () => {
        const newSize = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
        };
        setWindowSize(newSize);
        console.log("Window resized:");
        console.table(newSize);
        let bw=newSize.innerWidth/2;
        while (bw>newSize.innerHeight/1.4 ){
              bw=bw-20;
        }
        setBoardWidth(bw);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => { window.removeEventListener("resize", handleResize); };
  }, []);


  // --- Load Game on Mount ---
  useEffect(() => {
    // ... (keep existing implementation - no changes needed here)
     console.log("Attempting to initialize game state...");
    let loadedGame = null;
    let loadedHistory = [];
    let loadSource = "";
    const storageKey = getStorageKey(initialFen);
    let blackToMoveInitially = false;

    if (initialFen) {
      loadSource = "initialFen prop";
      console.log(`Initializing game from provided initialFen: ${initialFen}`);
      try {
        loadedGame = new Chess(initialFen);
        if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
        blackToMoveInitially = loadedGame.turn() === 'b';
        loadedHistory = [];
        console.log("Successfully initialized game from initialFen.");
        try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
      } catch (fenError) {
        console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
        loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
        blackToMoveInitially = false;
      }
    } else {
      loadSource = "localStorage attempt";
      console.log("No initialFen. Attempting load from storage...");
       blackToMoveInitially = false;
      try {
        const storedHistoryString = localStorage.getItem(storageKey);
        if (storedHistoryString) {
          const parsedHistory = JSON.parse(storedHistoryString);
          if (Array.isArray(parsedHistory)) {
            loadedGame = new Chess();
            try {
              parsedHistory.forEach(san => loadedGame.move(san));
              console.log("Successfully replayed history from storage.");
              loadedHistory = parsedHistory; loadSource = "localStorage success";
            } catch (replayError) {
              console.error("Error replaying stored history:", replayError);
              localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage replay error";
            }
          } else { localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage format error"; }
        } else { loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage empty"; }
      } catch (parseError) { localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage parse error"; }
    }

    setGame(loadedGame);
    setFen(loadedGame.fen());
    setMoveHistory(loadedHistory);
    updateGameStatus(loadedGame);

    const currentTurn = loadedGame.turn();
    const playerColor = currentTurn === 'w' ? 'white' : 'black';
    setHumanPlayerColor(playerColor);

    setStartedWithBlackMove(blackToMoveInitially);
    console.log(`Game loaded. Current Turn: ${currentTurn}. Human Player controls: ${playerColor}. Started w/ Black move: ${blackToMoveInitially}`);

    setIsGameLoading(false);
    console.log(`Game loading complete. Source: ${loadSource}`);
  }, [initialFen, updateGameStatus]);


  // --- Core Game Logic (MODIFIED to play sounds) ---
  const makeMove = useCallback((move) => {
    if (!game) return false;

    let moveResult = null;
    let success = false;
    const tempGame = new Chess(game.fen()); // Use a temporary instance for validation

    try {
      moveResult = tempGame.move(move);
    } catch (e) {
      console.error("Error making move:", e);
      moveResult = null;
    }

    if (moveResult) {
      console.log(`[makeMove] Success: ${moveResult.san}`);

      // --- Play Sound based on move result and game state *after* move ---
      if (tempGame.isCheckmate()) {
        playSound('gameEnd');
      } else if (tempGame.isStalemate() || tempGame.isDraw()) { // Catch other draw conditions too
         playSound('gameEnd');
      } else if (tempGame.inCheck()) {
        // Play check sound even if it was also a capture/castle/promote
        playSound('check');
      } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
        playSound('castle');
      } else if (moveResult.flags.includes('p')) {
        playSound('promote');
      } else if (moveResult.flags.includes('c')) {
        playSound('capture');
      } else {
        // Default move sound if none of the above
        playSound('move');
      }
      // --- End Sound Logic ---

      // Now update the actual game state
      setGame(tempGame);
      setFen(tempGame.fen());
      setMoveHistory((prev) => {
          const nextHistory = [...prev, moveResult.san];
          const storageKey = getStorageKey(initialFen);
          try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved (${storageKey})`); } catch (e) { console.error("Failed to save history:", e); }
          return nextHistory;
      });
      setForwardMoves([]);
      updateGameStatus(tempGame);
      if (aiEnabled) setPauseAi(false);
      success = true;
    } else {
      console.log("[makeMove] Failed (Illegal Move/Error):", move);
      success = false;
    }

    // Reset UI selections regardless of success/failure
    setSelectedSquare(null);
    setHighlightedSquares([]);
    return success;
  }, [game, updateGameStatus, aiEnabled, initialFen]); // Added dependencies


  // --- react-chessboard Callbacks (Unchanged) ---
  const isDraggablePiece = useCallback(({ piece }) => {
    // ... (keep existing implementation)
     if (!game || game.isGameOver() || isGameLoading) return false;
    const pieceColor = piece[0];
    const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';
    if (aiEnabled) {
        const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
        const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
        return isHumanTurn && isHumanPiece;
    } else { return game.turn() === pieceColor; }
  }, [game, aiEnabled, isGameLoading, humanPlayerColor]);

  const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
    // ... (keep existing implementation)
     if (!game || isGameLoading || !piece || piece[1].toLowerCase() !== 'p') return false;
    return checkIsPromotion(sourceSquare, targetSquare);
  }, [checkIsPromotion, game, isGameLoading]);

  const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
    // ... (keep existing implementation)
     if (!game || isGameLoading || !piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
    const promotionPiece = piece[1].toLowerCase();
    const fromSq = promoteFromSquare ?? pendingManualPromotion?.from;
    const toSq = promoteToSquare ?? pendingManualPromotion?.to;
    if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
    const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); // makeMove will handle the sound
    if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
  }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

  const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
    // ... (keep existing implementation)
     if (!game || isGameLoading || game.isGameOver()) return false;
    const pieceColor = pieceString[0];
    const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
    if (aiEnabled && !isHumanTurn) return false;
    if (!aiEnabled && game.turn() !== pieceColor) return false;
    const isPromo = checkIsPromotion(sourceSquare, targetSquare);
    if (isPromo) return true; // Let onPromotionPieceSelect handle it
    else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }); // makeMove will handle sound
  }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

  const onSquareClick = useCallback((square) => {
    // ... (keep existing implementation)
     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;
    if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return;

    if (!selectedSquare) {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            const moves = game.moves({ square: square, verbose: true });
            if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
            else { setSelectedSquare(null); setHighlightedSquares([]); }
        } else { setSelectedSquare(null); setHighlightedSquares([]); }
    } else {
        if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; }
        if (highlightedSquares.includes(square)) {
            const isPromo = checkIsPromotion(selectedSquare, square);
            if (isPromo) {
                setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true);
                setSelectedSquare(null); setHighlightedSquares([]);
            } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); } // makeMove handles sound
        } else {
            const piece = game.get(square);
            if (piece && piece.color === game.turn()) {
                const moves = game.moves({ square: square, verbose: true });
                if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
                else { setSelectedSquare(null); setHighlightedSquares([]); }
            } else { setSelectedSquare(null); setHighlightedSquares([]); }
        }
    }
  }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


  // --- Control Button Functions (Unchanged - no sounds needed here usually) ---
  const resetGame = useCallback(() => {
     // ... (keep existing implementation)
     console.log("Resetting game.");
    const newGame = initialFen ? new Chess(initialFen) : new Chess();
    const initialTurn = newGame.turn();
    const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
    const blackStarted = initialTurn === 'b';
    console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed). Started w/ Black: ${blackStarted}`);
    setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
    setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
    setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
    setStartedWithBlackMove(blackStarted);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
  }, [updateGameStatus, initialFen]);

  const undoMove = useCallback(() => {
     // ... (keep existing implementation)
      if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
    const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
    if (moveHistory.length < movesToUndo || game.isGameOver()) return;
    console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
    const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
    const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
    setForwardMoves((prev) => [...undoneMoves, ...prev]);
    const baseGame = initialFen ? new Chess(initialFen) : new Chess();
    try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
    console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
    setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
    if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
    setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
  }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]);

  const forwardMove = useCallback(() => {
     // ... (keep existing implementation - could add sounds but less common)
      if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
    const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
    if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
    console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
    const redoSANs = forwardMoves.slice(0, movesToRedo);
    const remainingForwardMoves = forwardMoves.slice(movesToRedo);
    const tempGame = new Chess(game.fen());
    let lastMoveResult = null; // Store the result of the last redone move
    try {
        for (const san of redoSANs) {
            lastMoveResult = tempGame.move(san); // Apply move and store result
        }
    } catch(e) {
        console.error("[Redo] Error replaying forward moves:", e);
        setForwardMoves([]); // Clear remaining if error occurs
        return;
    }

    // --- Optional: Play sound for the *last* redone move ---
    if (lastMoveResult) {
         if (tempGame.isCheckmate()) { playSound('gameEnd'); }
         else if (tempGame.isStalemate() || tempGame.isDraw()) { playSound('gameEnd'); }
         else if (tempGame.inCheck()) { playSound('check'); }
         else if (lastMoveResult.flags.includes('k') || lastMoveResult.flags.includes('q')) { playSound('castle'); }
         else if (lastMoveResult.flags.includes('p')) { playSound('promote'); }
         else if (lastMoveResult.flags.includes('c')) { playSound('capture'); }
         else { playSound('move'); }
    }
    // --- End Optional Redo Sound ---

    const nextHistory = [...moveHistory, ...redoSANs];
    console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
    setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
    setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
    if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
    setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
  }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]); // Added dependencies


  // --- AI Logic (Unchanged - makeMove will handle sounds for AI moves) ---
  const fetchBestMove = useCallback(async (currentFen) => {
    // ... (keep existing implementation)
     const depth = 4;
    const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
    console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
    try {
        const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (data.success && data.bestmove && typeof data.bestmove === 'string') {
            const bestMoveString = data.bestmove.split(" ")[1];
            if (bestMoveString && bestMoveString.length >= 4) {
              const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4);
              const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
              return { from, to, promotion };
            } else { console.error("[fetchBestMove] Invalid bestmove format:", data.bestmove); return null; }
        } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; }
    } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
  }, []);

  useEffect(() => {
    // ... (keep existing implementation)
    if (!game || game.isGameOver() || isGameLoading) return;
    const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
    let timeoutId = null;
    if (aiEnabled && !pauseAi && isAITurn) {
      const currentFen = game.fen(); console.log(`[AI Effect] AI turn (${game.turn()}). Scheduling fetch...`);
      setIsAiThinking(true);
      timeoutId = setTimeout(async () => {
        const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
        if (stillValidToFetch) {
          console.log("[AI Effect] Fetching for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
          const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
          if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); } // makeMove handles sound
          else { console.log("[AI Effect] AI move aborted."); }
        } else { console.log("[AI Effect] AI fetch aborted."); }
        setIsAiThinking(false);
      }, 1000);
    } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking."); setIsAiThinking(false); }
    return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) setIsAiThinking(false); } };
  }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


  // --- Auto-scroll Move History (Unchanged) ---
  useEffect(() => {
    // ... (keep existing implementation)
    if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
  }, [moveHistory]);


  // --- Helper to generate custom square styles (Unchanged) ---
  const getCustomSquareStyles = useCallback(() => {
    // ... (keep existing implementation)
    const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
    highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
    if (selectedSquare) { styles[selectedSquare] = { backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
    if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
  }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


  // --- Render (Unchanged) ---
  return (
    <HStack align="start" spacing={6} p={5}>

      {/* --- Chessboard Area --- */}
      <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={3} px={1}>
          <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
            {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
            <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
              {isGameLoading ? "Loading Game..." : statusText}
            </Text>
          </Flex>
          <HStack spacing={3} align="center" flexShrink={0}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
              {aiEnabled ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})` : "Pass & Play"}
            </Text>
            <Switch id="ai-switch" colorScheme="teal" isChecked={aiEnabled} onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }} isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"/>
          </HStack>
        </Flex>

        {/* The Chessboard Component */}
        {isGameLoading ? (
            <Box width={`${boardWidth}px`} height={`${boardWidth}px`} display="flex" alignItems="center" justifyContent="center">
                <Text color={statusTextColor}>Loading Board...</Text>
            </Box>
        ) : (
            <Chessboard id="PlayerVsAiBoard" position={fen} isDraggablePiece={isDraggablePiece} onPieceDrop={onPieceDrop} onSquareClick={onSquareClick} onPromotionCheck={onPromotionCheck} onPromotionPieceSelect={handlePromotionPieceSelect} showPromotionDialog={promotionDialogOpen} promotionToSquare={pendingManualPromotion?.to ?? null} promotionDialogVariant="modal"
              boardOrientation={humanPlayerColor} boardWidth={boardWidth} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
        )}
      </Box>

      {/* --- Sidebar Area --- */}
      <VStack align="stretch" spacing={5} width="220px" pt={1}>
        {/* Controls Section */}
        <Divider />
        {/* Move History Section */}
         <VStack align="stretch" spacing={2}>
             <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
            <Box
              ref={moveHistoryRef}
              h={Math.min(windowSize.innerHeight/2,windowSize.innerWidth/3)}
              w={Math.min(windowSize.innerWidth/4, windowSize.innerHeight/3.7)}
              overflowY="auto"
              bg={historyBg} p={3} borderRadius="md" boxShadow="md"  border="1px" borderColor={historyBorderColor}
              sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
            >
              {isGameLoading ? (
                  <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
              ) :
                (moveHistory.length === 0 && !startedWithBlackMove) ? (
                  <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
                ) : (
                 <VStack spacing={1} align="stretch">
                    {(() => {
                        const pairs = [];
                        if (startedWithBlackMove) {
                            const blackFirstMove = moveHistory.length > 0 ? moveHistory[0] : undefined;
                            pairs.push({
                                moveNumber: 1,
                                white: "...",
                                black: blackFirstMove,
                                isWhiteLast: false,
                                isBlackLast: moveHistory.length === 1,
                                usePlaceholderStyle: true,
                            });
                            for (let i = 1; i < moveHistory.length; i += 2) {
                                pairs.push({
                                    moveNumber: Math.floor(i / 2) + 2,
                                    white: moveHistory[i],
                                    black: moveHistory[i + 1],
                                    isWhiteLast: i === moveHistory.length - 1,
                                    isBlackLast: (i + 1) === moveHistory.length - 1,
                                    usePlaceholderStyle: false,
                                });
                            }
                        } else {
                            for (let i = 0; i < moveHistory.length; i += 2) {
                                pairs.push({
                                    moveNumber: (i / 2) + 1,
                                    white: moveHistory[i],
                                    black: moveHistory[i + 1],
                                    isWhiteLast: i === moveHistory.length - 1,
                                    isBlackLast: (i + 1) === moveHistory.length - 1,
                                    usePlaceholderStyle: false,
                                });
                            }
                        }
                        if (startedWithBlackMove && moveHistory.length === 0 && pairs.length === 0) {
                           pairs.push({ moveNumber: 1, white: "...", black: undefined, isWhiteLast: false, isBlackLast: false, usePlaceholderStyle: true });
                        }

                        return pairs.map((item) => (
                            <Flex key={item.moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
                                <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{item.moveNumber}.</Text>
                                <Text
                                    minW="55px" px={1}
                                    fontWeight={item.isWhiteLast ? 'extrabold': 'normal'}
                                    color={item.usePlaceholderStyle ? placeholderMoveColor : (item.isWhiteLast ? lastMoveColor : defaultMoveColor)}
                                    title={item.usePlaceholderStyle ? "White move 1: (skipped)" : (item.white ? `White move ${item.moveNumber}: ${item.white}`: '')}
                                    visibility={item.white ? 'visible' : 'hidden'}
                                >
                                    {item.white ?? ""}
                                </Text>
                                <Text
                                    minW="55px" px={1}
                                    fontWeight={item.isBlackLast ? 'extrabold': 'normal'}
                                    color={item.isBlackLast ? lastMoveColor : defaultMoveColor}
                                    visibility={item.black ? 'visible' : 'hidden'}
                                    title={item.black ? `Black move ${item.moveNumber}: ${item.black}`: ''}
                                >
                                    {item.black ?? ""}
                                </Text>
                            </Flex>
                        ));
                    })()}
                 </VStack>
              )}
            </Box>
         </VStack>
         {/* Controls */}
         <VStack align="stretch" spacing={3}>
             <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
             <HStack spacing={3}>
               <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
               <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
             </HStack>
             <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
        </VStack>

      </VStack>
    </HStack>
  );
};

export default ChessGame;