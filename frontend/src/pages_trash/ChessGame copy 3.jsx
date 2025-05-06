// // // // // // // // import React from 'react';
// // // // // // // // import { Box } from '@chakra-ui/react';
// // // // // // // // import { Chessboard } from "react-chessboard";

// // // // // // // // function ChessGame({ fen }) {
// // // // // // // //   return (
// // // // // // // //     <Box>
// // // // // // // //       <Chessboard 
// // // // // // // //         position={fen || "start"}
// // // // // // // //         arePiecesDraggable={false}
// // // // // // // //         boardWidth={400}
// // // // // // // //       />
// // // // // // // //     </Box>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default ChessGame;
// // // // // // // import React, { useState, useEffect, useCallback, useRef } from "react";
// // // // // // // import { Chess } from "chess.js"; // Ensure installed: npm install chess.js
// // // // // // // import { Chessboard } from "react-chessboard"; // Ensure installed: npm install react-chessboard
// // // // // // // import {
// // // // // // //   Box,
// // // // // // //   Text,
// // // // // // //   VStack,
// // // // // // //   Button,
// // // // // // //   HStack,
// // // // // // //   Divider,
// // // // // // //   useColorModeValue,
// // // // // // //   Flex,
// // // // // // //   Switch,
// // // // // // //   Spinner,
// // // // // // // } from "@chakra-ui/react"; // Ensure installed: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

// // // // // // // // --- Local Storage Key ---
// // // // // // // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';

// // // // // // // // --- Helper Functions (Logical - Unchanged) ---
// // // // // // // const findKingSquareFn = (gameInstance) => {
// // // // // // //     if (!gameInstance) return null;
// // // // // // //     const board = gameInstance.board();
// // // // // // //     for (let r = 0; r < 8; r++) {
// // // // // // //       for (let c = 0; c < 8; c++) {
// // // // // // //         const piece = board[r][c];
// // // // // // //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// // // // // // //           return "abcdefgh"[c] + (8 - r);
// // // // // // //         }
// // // // // // //       }
// // // // // // //     }
// // // // // // //     return null;
// // // // // // // };
// // // // // // // const checkIsPromotionFn = (gameInstance, from, to) => {
// // // // // // //     if (!from || !to || !gameInstance) return false;
// // // // // // //     const piece = gameInstance.get(from);
// // // // // // //     if (!piece || piece.type !== 'p') return false;
// // // // // // //     const targetRank = to[1];
// // // // // // //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// // // // // // //     if (targetRank !== promotionRank) return false;
// // // // // // //     const moves = gameInstance.moves({ square: from, verbose: true });
// // // // // // //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // // // // // // };


// // // // // // // // --- Main Component ---
// // // // // // // // **** MODIFIED: Accept initialFen prop ****
// // // // // // // const ChessGame = ({ initialFen }) => {
// // // // // // //   // --- State ---
// // // // // // //   const [game, setGame] = useState(null); // Initialize as null, load in useEffect
// // // // // // //   // **** MODIFIED: Default to initialFen if provided, otherwise 'start' as placeholder before load ****
// // // // // // //   const [fen, setFen] = useState(initialFen || "start");
// // // // // // //   const [moveHistory, setMoveHistory] = useState([]);
// // // // // // //   const [forwardMoves, setForwardMoves] = useState([]);
// // // // // // //   const [playerColor] = useState("white");
// // // // // // //   const [aiEnabled, setAiEnabled] = useState(true);
// // // // // // //   const [pauseAi, setPauseAi] = useState(false);
// // // // // // //   const [isAiThinking, setIsAiThinking] = useState(false);
// // // // // // //   const [selectedSquare, setSelectedSquare] = useState(null);
// // // // // // //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// // // // // // //   const [statusText, setStatusText] = useState("Loading Game..."); // Initial status
// // // // // // //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// // // // // // //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// // // // // // //   const [isGameLoading, setIsGameLoading] = useState(true); // Loading state

// // // // // // //   // --- Refs (Unchanged) ---
// // // // // // //   const moveHistoryRef = useRef(null);

// // // // // // //   // --- UI Styling Values (Unchanged) ---
// // // // // // //   const pageBg = useColorModeValue("gray.100", "gray.800");
// // // // // // //   const boardContainerBg = useColorModeValue("white", "gray.700");
// // // // // // //   const historyBg = useColorModeValue("white", "gray.700");
// // // // // // //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// // // // // // //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// // // // // // //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// // // // // // //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// // // // // // //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// // // // // // //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// // // // // // //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// // // // // // //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// // // // // // //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// // // // // // //   const lastMoveColor = useColorModeValue('black','white');
// // // // // // //   const defaultMoveColor = useColorModeValue(undefined, undefined);
// // // // // // //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// // // // // // //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// // // // // // //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// // // // // // //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// // // // // // //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// // // // // // //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// // // // // // //   // --- Utility Functions (Unchanged) ---
// // // // // // //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// // // // // // //   const updateGameStatus = useCallback((currentGame) => {
// // // // // // //     if (!currentGame) {
// // // // // // //         setStatusText("Game not loaded");
// // // // // // //         return;
// // // // // // //     }
// // // // // // //     let status = "";
// // // // // // //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// // // // // // //     else if (currentGame.isStalemate()) status = "Stalemate!";
// // // // // // //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// // // // // // //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// // // // // // //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// // // // // // //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// // // // // // //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// // // // // // //     setStatusText(status);
// // // // // // //   }, []); // No dependencies needed

// // // // // // //   // --- Load Game on Mount ---
// // // // // // //   // **** MODIFIED: Handles initialFen prop or falls back to localStorage/default ****
// // // // // // //   useEffect(() => {
// // // // // // //     console.log("Attempting to initialize game state...");
// // // // // // //     let loadedGame = null;
// // // // // // //     let loadedHistory = [];
// // // // // // //     let loadSource = ""; // For logging purposes

// // // // // // //     // --- Priority 1: Use initialFen prop if provided ---
// // // // // // //     if (initialFen) {
// // // // // // //       loadSource = "initialFen prop";
// // // // // // //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// // // // // // //       try {
// // // // // // //         // Attempt to load the game from the provided FEN
// // // // // // //         loadedGame = new Chess(initialFen);

// // // // // // //         // Basic validation check (chess.js might not throw for all invalid FENs but might return an unusable state)
// // // // // // //         if (!loadedGame || !loadedGame.fen()) {
// // // // // // //             throw new Error("Chess.js could not properly parse the provided FEN string.");
// // // // // // //         }

// // // // // // //         // If FEN is valid, start with an empty history for this specific game instance
// // // // // // //         loadedHistory = [];
// // // // // // //         console.log("Successfully initialized game from initialFen.");

// // // // // // //         // ** Clear localStorage: Starting with a specific FEN means we don't want to load old history **
// // // // // // //         try {
// // // // // // //           localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // // //           console.log("Cleared previous game history from local storage due to initialFen prop.");
// // // // // // //         } catch (storageError) {
// // // // // // //           console.error("Failed to clear local storage while handling initialFen:", storageError);
// // // // // // //         }

// // // // // // //       } catch (fenError) {
// // // // // // //         // Handle invalid FEN from prop
// // // // // // //         console.error(`**************************************************`);
// // // // // // //         console.error(`* ERROR: Invalid initialFen prop provided: "${initialFen}"`);
// // // // // // //         console.error(`* Error details: ${fenError.message}`);
// // // // // // //         console.error(`* Falling back to the standard initial chess position.`);
// // // // // // //         console.error(`**************************************************`);
// // // // // // //         loadedGame = new Chess(); // Fallback to default starting position
// // // // // // //         loadedHistory = [];
// // // // // // //         loadSource = "initialFen error fallback";
// // // // // // //       }
// // // // // // //     }
// // // // // // //     // --- Priority 2: Try loading from localStorage if no initialFen prop ---
// // // // // // //     else {
// // // // // // //       loadSource = "localStorage attempt";
// // // // // // //       console.log("No initialFen prop. Attempting to load game from local storage...");
// // // // // // //       try {
// // // // // // //         const storedHistoryString = localStorage.getItem(LOCAL_STORAGE_KEY);
// // // // // // //         if (storedHistoryString) {
// // // // // // //           console.log("Found stored history:", storedHistoryString);
// // // // // // //           const parsedHistory = JSON.parse(storedHistoryString); // Potential error point 1

// // // // // // //           if (Array.isArray(parsedHistory)) {
// // // // // // //             loadedGame = new Chess(); // Start fresh before replaying
// // // // // // //             try {
// // // // // // //               parsedHistory.forEach(san => loadedGame.move(san)); // Potential error point 2 (invalid SAN)
// // // // // // //               console.log("Successfully replayed history from local storage.");
// // // // // // //               loadedHistory = parsedHistory; // Use the successfully replayed history
// // // // // // //               loadSource = "localStorage success";
// // // // // // //             } catch (replayError) {
// // // // // // //               console.error("Error replaying stored history:", replayError);
// // // // // // //               console.warn("Stored history seems invalid. Clearing storage and starting fresh.");
// // // // // // //               localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
// // // // // // //               loadedGame = new Chess(); // Reset to new game
// // // // // // //               loadedHistory = []; // Reset history
// // // // // // //               loadSource = "localStorage replay error fallback";
// // // // // // //             }
// // // // // // //           } else {
// // // // // // //             console.warn("Stored history is not an array. Clearing storage and starting fresh.");
// // // // // // //             localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
// // // // // // //             loadedGame = new Chess(); // Start fresh if format is wrong
// // // // // // //             loadedHistory = [];
// // // // // // //             loadSource = "localStorage format error fallback";
// // // // // // //           }
// // // // // // //         } else {
// // // // // // //           console.log("No stored history found. Starting new game.");
// // // // // // //           loadedGame = new Chess(); // Start new game if nothing stored
// // // // // // //           loadedHistory = [];
// // // // // // //           loadSource = "localStorage empty fallback";
// // // // // // //         }
// // // // // // //       } catch (parseError) {
// // // // // // //         console.error("Error parsing stored history:", parseError);
// // // // // // //         console.warn("Clearing potentially corrupted storage and starting fresh.");
// // // // // // //         localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
// // // // // // //         loadedGame = new Chess(); // Reset to new game
// // // // // // //         loadedHistory = [];
// // // // // // //         loadSource = "localStorage parse error fallback";
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // --- Set the final loaded/new game state ---
// // // // // // //     setGame(loadedGame);
// // // // // // //     setFen(loadedGame.fen()); // Crucial: Set fen state based on the final loadedGame
// // // // // // //     setMoveHistory(loadedHistory);
// // // // // // //     updateGameStatus(loadedGame);
// // // // // // //     setIsGameLoading(false); // Mark loading as complete
// // // // // // //     console.log(`Game loading complete. Source: ${loadSource}`);

// // // // // // //   // **** MODIFIED: Add initialFen to dependency array ****
// // // // // // //   // This ensures the effect re-runs if the prop changes, though usually it's set once on mount.
// // // // // // //   }, [initialFen, updateGameStatus]);


// // // // // // //   // --- Core Game Logic (Unchanged) ---
// // // // // // //   const makeMove = useCallback((move) => {
// // // // // // //     if (!game) { console.warn("[makeMove] Attempted move before game loaded."); return false; }
// // // // // // //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// // // // // // //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Unexpected error during tempGame.move:", e); moveResult = null; }
// // // // // // //     if (moveResult) {
// // // // // // //       console.log(`[makeMove] Success: ${moveResult.san}`);
// // // // // // //       setGame(tempGame); setFen(tempGame.fen());
// // // // // // //       setMoveHistory((prev) => {
// // // // // // //           const nextHistory = [...prev, moveResult.san];
// // // // // // //           try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory)); console.log("Move history saved to local storage."); } catch (storageError) { console.error("Failed to save move history to local storage:", storageError); }
// // // // // // //           return nextHistory;
// // // // // // //       });
// // // // // // //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
// // // // // // //     } else { console.log("[makeMove] Failed (Illegal Move or Error):", move); success = false; }
// // // // // // //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// // // // // // //   }, [game, updateGameStatus, aiEnabled]);


// // // // // // //   // --- react-chessboard Callbacks (Logical - Unchanged) ---
// // // // // // //   const isDraggablePiece = useCallback(({ piece }) => {
// // // // // // //     if (!game || game.isGameOver() || isGameLoading) return false;
// // // // // // //     const pieceColor = piece[0];
// // // // // // //     if (aiEnabled) { return game.turn() === playerColor.charAt(0) && pieceColor === playerColor.charAt(0); }
// // // // // // //     else { return game.turn() === pieceColor; }
// // // // // // //   }, [game, playerColor, aiEnabled, isGameLoading]);
// // // // // // //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// // // // // // //     if (!game || isGameLoading) return false;
// // // // // // //     if (!piece || piece[1].toLowerCase() !== 'p') return false;
// // // // // // //     return checkIsPromotion(sourceSquare, targetSquare);
// // // // // // //   }, [checkIsPromotion, game, isGameLoading]);
// // // // // // //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// // // // // // //     if (!game || isGameLoading) return false;
// // // // // // //     if (!piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// // // // // // //     const promotionPiece = piece[1].toLowerCase(); const fromSq = promoteFromSquare ?? pendingManualPromotion?.from; const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// // // // // // //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// // // // // // //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// // // // // // //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);
// // // // // // //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// // // // // // //     if (!game || isGameLoading) return false;
// // // // // // //     const pieceColor = pieceString[0]; if (game.isGameOver() || (aiEnabled && game.turn() !== playerColor.charAt(0)) || (!aiEnabled && game.turn() !== pieceColor)) { return false; }
// // // // // // //     const isPromo = checkIsPromotion(sourceSquare, targetSquare); if (isPromo) { return true; } else { const success = makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }); return success; }
// // // // // // //   }, [game, playerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);
// // // // // // //   const onSquareClick = useCallback((square) => {
// // // // // // //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return; if (aiEnabled && game.turn() !== playerColor.charAt(0)) return;
// // // // // // //     if (!selectedSquare) { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // // // // //     } else { if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; } if (highlightedSquares.includes(square)) { const isPromo = checkIsPromotion(selectedSquare, square); if (isPromo) { setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true); setSelectedSquare(null); setHighlightedSquares([]); return; } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); } } else { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); } } }
// // // // // // //   }, [game, selectedSquare, highlightedSquares, playerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


// // // // // // //   // --- Control Button Functions (Unchanged) ---
// // // // // // //   const resetGame = useCallback(() => {
// // // // // // //     console.log("Resetting game.");
// // // // // // //     const newGame = new Chess(); setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]); setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
// // // // // // //     try { localStorage.removeItem(LOCAL_STORAGE_KEY); console.log("Cleared local storage on reset."); } catch (e) { console.error("Failed to clear local storage on reset:", e); }
// // // // // // //   }, [updateGameStatus]);
// // // // // // //   const undoMove = useCallback(() => {
// // // // // // //     if (!game || isGameLoading || isAiThinking) return; const movesToUndo = aiEnabled ? 2 : 1; if (moveHistory.length < movesToUndo || game.isGameOver()) return; console.log(`[Undo] Undoing last ${movesToUndo} move(s).`); const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo); const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo); setForwardMoves((prev) => [...undoneMoves, ...prev]); const newGame = new Chess();
// // // // // // //     try { newHistory.forEach((san) => newGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
// // // // // // //     setGame(newGame); setFen(newGame.fen()); setMoveHistory(newHistory);
// // // // // // //     try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory)); console.log("Updated history saved to local storage after undo."); } catch (storageError) { console.error("Failed to save history to local storage after undo:", storageError); }
// // // // // // //     if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(newGame); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// // // // // // //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking]);
// // // // // // //   const forwardMove = useCallback(() => {
// // // // // // //     if (!game || isGameLoading || isAiThinking) return; const movesToRedo = aiEnabled ? 2 : 1; if (forwardMoves.length < movesToRedo || game.isGameOver()) return; console.log(`[Redo] Redoing ${movesToRedo} move(s).`); const redoSANs = forwardMoves.slice(0, movesToRedo); const remainingForwardMoves = forwardMoves.slice(movesToRedo); const tempGame = new Chess(game.fen());
// // // // // // //     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", redoSANs, e); setForwardMoves([]); return; }
// // // // // // //     const nextHistory = [...moveHistory, ...redoSANs]; setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
// // // // // // //     try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory)); console.log("Updated history saved to local storage after redo."); } catch (storageError) { console.error("Failed to save history to local storage after redo:", storageError); }
// // // // // // //     setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// // // // // // //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking]);


// // // // // // //   // --- AI Logic (Unchanged) ---
// // // // // // //   const fetchBestMove = useCallback(async (currentFen) => {
// // // // // // //     const depth = 5; const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`; console.log("[fetchBestMove] Fetching AI move...");
// // // // // // //     try { const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`); const data = await res.json(); if (data.success && data.bestmove) { const bestMoveString = data.bestmove.split(" ")[1]; const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4); const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined; console.log("[fetchBestMove] AI Move received:", { from, to, promotion }); return { from, to, promotion }; } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; } } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
// // // // // // //   }, []);
// // // // // // //   useEffect(() => {
// // // // // // //     if (!game || game.isGameOver() || isGameLoading) return; const isAITurn = game.turn() !== playerColor.charAt(0); let timeoutId = null;
// // // // // // //     if (aiEnabled && !pauseAi && isAITurn) {
// // // // // // //       const currentFen = game.fen(); console.log("[AI Effect] AI turn detected. Scheduling fetch..."); setIsAiThinking(true);
// // // // // // //       timeoutId = setTimeout(async () => {
// // // // // // //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
// // // // // // //         if (stillValidToFetch) {
// // // // // // //           console.log("[AI Effect] Executing fetch for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
// // // // // // //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
// // // // // // //           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); } else { console.log("[AI Effect] AI move aborted before applying (state changed during fetch or fetch failed)."); }
// // // // // // //         } else { console.log("[AI Effect] AI move fetch aborted (state changed before timeout execution)."); }
// // // // // // //         setIsAiThinking(false);
// // // // // // //       }, 1000);
// // // // // // //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking indicator."); setIsAiThinking(false); }
// // // // // // //     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI move timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== playerColor.charAt(0)) { setIsAiThinking(false); } } };
// // // // // // //   }, [fen, game, aiEnabled, pauseAi, playerColor, fetchBestMove, makeMove, isGameLoading]);


// // // // // // //   // --- Auto-scroll Move History (Unchanged) ---
// // // // // // //   useEffect(() => {
// // // // // // //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// // // // // // //   }, [moveHistory]);


// // // // // // //   // --- Helper to generate custom square styles (Unchanged) ---
// // // // // // //   const getCustomSquareStyles = useCallback(() => {
// // // // // // //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// // // // // // //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// // // // // // //     if (selectedSquare) { styles[selectedSquare] = { ...(styles[selectedSquare] ?? {}), backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// // // // // // //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// // // // // // //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// // // // // // //   // --- Render (Unchanged - relies on the `fen` state which is set correctly by the useEffect) ---
// // // // // // //   return (
// // // // // // //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// // // // // // //       {/* --- Chessboard Area --- */}
// // // // // // //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// // // // // // //         {/* Header */}
// // // // // // //         <Flex justify="space-between" align="center" mb={3} px={1}>
// // // // // // //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// // // // // // //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// // // // // // //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// // // // // // //               {statusText}
// // // // // // //             </Text>
// // // // // // //           </Flex>
// // // // // // //           <HStack spacing={3} align="center" flexShrink={0}>
// // // // // // //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// // // // // // //               {aiEnabled ? "vs AI (Black)" : "Pass & Play"}
// // // // // // //             </Text>
// // // // // // //             <Switch
// // // // // // //               id="ai-switch" colorScheme="teal" isChecked={aiEnabled}
// // // // // // //               onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }}
// // // // // // //               isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"
// // // // // // //             />
// // // // // // //           </HStack>
// // // // // // //         </Flex>

// // // // // // //         {/* The Chessboard Component */}
// // // // // // //         {isGameLoading ? (
// // // // // // //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// // // // // // //                 <Text color={statusTextColor}>Loading Board...</Text>
// // // // // // //             </Box>
// // // // // // //         ) : (
// // // // // // //             <Chessboard
// // // // // // //               id="PlayerVsAiBoard"
// // // // // // //               position={fen} // This uses the `fen` state variable, correctly set by useEffect
// // // // // // //               isDraggablePiece={isDraggablePiece}
// // // // // // //               onPieceDrop={onPieceDrop}
// // // // // // //               onSquareClick={onSquareClick}
// // // // // // //               onPromotionCheck={onPromotionCheck}
// // // // // // //               onPromotionPieceSelect={handlePromotionPieceSelect}
// // // // // // //               showPromotionDialog={promotionDialogOpen}
// // // // // // //               promotionToSquare={pendingManualPromotion?.to ?? null}
// // // // // // //               promotionDialogVariant="modal"
// // // // // // //               boardOrientation={playerColor}
// // // // // // //               boardWidth={420}
// // // // // // //               customSquareStyles={getCustomSquareStyles()}
// // // // // // //               customDarkSquareStyle={customDarkSquareStyle}
// // // // // // //               customLightSquareStyle={customLightSquareStyle}
// // // // // // //               snapToCursor={true}
// // // // // // //               animationDuration={150}
// // // // // // //             />
// // // // // // //         )}
// // // // // // //       </Box>

// // // // // // //       {/* --- Sidebar Area (Unchanged) --- */}
// // // // // // //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// // // // // // //         {/* Controls Section */}
// // // // // // //         <VStack align="stretch" spacing={3}>
// // // // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// // // // // // //              <HStack spacing={3}>
// // // // // // //                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
// // // // // // //                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
// // // // // // //              </HStack>
// // // // // // //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// // // // // // //         </VStack>
// // // // // // //         <Divider />

// // // // // // //         {/* Move History Section */}
// // // // // // //          <VStack align="stretch" spacing={2}>
// // // // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// // // // // // //             <Box
// // // // // // //               ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// // // // // // //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// // // // // // //             >
// // // // // // //               {isGameLoading ? (
// // // // // // //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// // // // // // //               ) : moveHistory.length === 0 ? (
// // // // // // //                 <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// // // // // // //                ) : (
// // // // // // //                  <VStack spacing={1} align="stretch">
// // // // // // //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
// // // // // // //                         const moveNumber = i + 1; const whiteMoveIndex = i * 2; const blackMoveIndex = i * 2 + 1; const isLastWhite = whiteMoveIndex === moveHistory.length - 1; const isLastBlack = blackMoveIndex === moveHistory.length - 1;
// // // // // // //                         return (
// // // // // // //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// // // // // // //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>
// // // // // // //                              <Text minW="55px" px={1} fontWeight={isLastWhite ? 'extrabold': 'normal'} color={isLastWhite ? lastMoveColor : defaultMoveColor} title={`White move ${moveNumber}: ${moveHistory[whiteMoveIndex]}`}> {moveHistory[whiteMoveIndex] ?? ""} </Text>
// // // // // // //                              <Text minW="55px" px={1} fontWeight={isLastBlack ? 'extrabold': 'normal'} color={isLastBlack ? lastMoveColor : defaultMoveColor} visibility={moveHistory[blackMoveIndex] ? 'visible' : 'hidden'} title={moveHistory[blackMoveIndex] ? `Black move ${moveNumber}: ${moveHistory[blackMoveIndex]}` : ''} > {moveHistory[blackMoveIndex] ?? ""} </Text>
// // // // // // //                           </Flex>
// // // // // // //                         )
// // // // // // //                     })}
// // // // // // //                  </VStack>
// // // // // // //               )}
// // // // // // //             </Box>
// // // // // // //          </VStack>
// // // // // // //       </VStack>
// // // // // // //     </HStack>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ChessGame;

// // // // // // import React, { useState, useEffect, useCallback, useRef } from "react";
// // // // // // import { Chess } from "chess.js"; // Ensure installed: npm install chess.js
// // // // // // import { Chessboard } from "react-chessboard"; // Ensure installed: npm install react-chessboard
// // // // // // import {
// // // // // //   Box,
// // // // // //   Text,
// // // // // //   VStack,
// // // // // //   Button,
// // // // // //   HStack,
// // // // // //   Divider,
// // // // // //   useColorModeValue,
// // // // // //   Flex,
// // // // // //   Switch,
// // // // // //   Spinner,
// // // // // // } from "@chakra-ui/react"; // Ensure installed: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

// // // // // // // --- Local Storage Key ---
// // // // // // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';

// // // // // // // --- Helper Functions (Logical - Unchanged) ---
// // // // // // // (findKingSquareFn and checkIsPromotionFn remain exactly the same as in your provided code)
// // // // // // const findKingSquareFn = (gameInstance) => {
// // // // // //     if (!gameInstance) return null;
// // // // // //     const board = gameInstance.board();
// // // // // //     for (let r = 0; r < 8; r++) {
// // // // // //       for (let c = 0; c < 8; c++) {
// // // // // //         const piece = board[r][c];
// // // // // //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// // // // // //           return "abcdefgh"[c] + (8 - r);
// // // // // //         }
// // // // // //       }
// // // // // //     }
// // // // // //     return null;
// // // // // // };
// // // // // // const checkIsPromotionFn = (gameInstance, from, to) => {
// // // // // //     if (!from || !to || !gameInstance) return false;
// // // // // //     const piece = gameInstance.get(from);
// // // // // //     if (!piece || piece.type !== 'p') return false;
// // // // // //     const targetRank = to[1];
// // // // // //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// // // // // //     if (targetRank !== promotionRank) return false;
// // // // // //     const moves = gameInstance.moves({ square: from, verbose: true });
// // // // // //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // // // // // };


// // // // // // // --- Main Component ---
// // // // // // const ChessGame = ({ initialFen }) => {
// // // // // //   // --- State ---
// // // // // //   const [game, setGame] = useState(null);
// // // // // //   const [fen, setFen] = useState(initialFen || "start"); // Initial placeholder
// // // // // //   const [moveHistory, setMoveHistory] = useState([]);
// // // // // //   const [forwardMoves, setForwardMoves] = useState([]);
// // // // // //   const [playerColor] = useState("white");
// // // // // //   const [aiEnabled, setAiEnabled] = useState(true);
// // // // // //   const [pauseAi, setPauseAi] = useState(false);
// // // // // //   const [isAiThinking, setIsAiThinking] = useState(false);
// // // // // //   const [selectedSquare, setSelectedSquare] = useState(null);
// // // // // //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// // // // // //   const [statusText, setStatusText] = useState("Loading Game...");
// // // // // //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// // // // // //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// // // // // //   const [isGameLoading, setIsGameLoading] = useState(true);

// // // // // //   // --- Refs (Unchanged) ---
// // // // // //   const moveHistoryRef = useRef(null);

// // // // // //   // --- UI Styling Values (Unchanged) ---
// // // // // //   const pageBg = useColorModeValue("gray.100", "gray.800");
// // // // // //   const boardContainerBg = useColorModeValue("white", "gray.700");
// // // // // //   const historyBg = useColorModeValue("white", "gray.700");
// // // // // //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// // // // // //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// // // // // //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// // // // // //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// // // // // //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// // // // // //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// // // // // //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// // // // // //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// // // // // //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// // // // // //   const lastMoveColor = useColorModeValue('black','white');
// // // // // //   const defaultMoveColor = useColorModeValue(undefined, undefined);
// // // // // //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// // // // // //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// // // // // //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// // // // // //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// // // // // //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// // // // // //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// // // // // //   // --- Utility Functions (Unchanged) ---
// // // // // //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// // // // // //   const updateGameStatus = useCallback((currentGame) => {
// // // // // //     if (!currentGame) {
// // // // // //         setStatusText("Game not loaded");
// // // // // //         return;
// // // // // //     }
// // // // // //     let status = "";
// // // // // //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// // // // // //     else if (currentGame.isStalemate()) status = "Stalemate!";
// // // // // //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// // // // // //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// // // // // //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// // // // // //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// // // // // //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// // // // // //     setStatusText(status);
// // // // // //   }, []);

// // // // // //   // --- Load Game on Mount (Unchanged from your provided code) ---
// // // // // //   useEffect(() => {
// // // // // //     console.log("Attempting to initialize game state...");
// // // // // //     let loadedGame = null;
// // // // // //     let loadedHistory = [];
// // // // // //     let loadSource = ""; // For logging purposes

// // // // // //     // --- Priority 1: Use initialFen prop if provided ---
// // // // // //     if (initialFen) {
// // // // // //       loadSource = "initialFen prop";
// // // // // //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// // // // // //       try {
// // // // // //         loadedGame = new Chess(initialFen);
// // // // // //         if (!loadedGame || !loadedGame.fen()) {
// // // // // //             throw new Error("Chess.js could not properly parse the provided FEN string.");
// // // // // //         }
// // // // // //         loadedHistory = [];
// // // // // //         console.log("Successfully initialized game from initialFen.");
// // // // // //         try {
// // // // // //           localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // //           console.log("Cleared previous game history from local storage due to initialFen prop.");
// // // // // //         } catch (storageError) {
// // // // // //           console.error("Failed to clear local storage while handling initialFen:", storageError);
// // // // // //         }
// // // // // //       } catch (fenError) {
// // // // // //         console.error(`**************************************************`);
// // // // // //         console.error(`* ERROR: Invalid initialFen prop provided: "${initialFen}"`);
// // // // // //         console.error(`* Error details: ${fenError.message}`);
// // // // // //         console.error(`* Falling back to the standard initial chess position.`);
// // // // // //         console.error(`**************************************************`);
// // // // // //         loadedGame = new Chess(); // Fallback to default starting position
// // // // // //         loadedHistory = [];
// // // // // //         loadSource = "initialFen error fallback";
// // // // // //       }
// // // // // //     }
// // // // // //     // --- Priority 2: Try loading from localStorage if no initialFen prop ---
// // // // // //     else {
// // // // // //       loadSource = "localStorage attempt";
// // // // // //       console.log("No initialFen prop. Attempting to load game from local storage...");
// // // // // //       try {
// // // // // //         const storedHistoryString = localStorage.getItem(LOCAL_STORAGE_KEY);
// // // // // //         if (storedHistoryString) {
// // // // // //           console.log("Found stored history:", storedHistoryString);
// // // // // //           const parsedHistory = JSON.parse(storedHistoryString);
// // // // // //           if (Array.isArray(parsedHistory)) {
// // // // // //             loadedGame = new Chess(); // Start fresh before replaying
// // // // // //             try {
// // // // // //               parsedHistory.forEach(san => loadedGame.move(san));
// // // // // //               console.log("Successfully replayed history from local storage.");
// // // // // //               loadedHistory = parsedHistory;
// // // // // //               loadSource = "localStorage success";
// // // // // //             } catch (replayError) {
// // // // // //               console.error("Error replaying stored history:", replayError);
// // // // // //               console.warn("Stored history seems invalid. Clearing storage and starting fresh.");
// // // // // //               localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // //               loadedGame = new Chess();
// // // // // //               loadedHistory = [];
// // // // // //               loadSource = "localStorage replay error fallback";
// // // // // //             }
// // // // // //           } else {
// // // // // //             console.warn("Stored history is not an array. Clearing storage and starting fresh.");
// // // // // //             localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // //             loadedGame = new Chess();
// // // // // //             loadedHistory = [];
// // // // // //             loadSource = "localStorage format error fallback";
// // // // // //           }
// // // // // //         } else {
// // // // // //           console.log("No stored history found. Starting new game.");
// // // // // //           loadedGame = new Chess();
// // // // // //           loadedHistory = [];
// // // // // //           loadSource = "localStorage empty fallback";
// // // // // //         }
// // // // // //       } catch (parseError) {
// // // // // //         console.error("Error parsing stored history:", parseError);
// // // // // //         console.warn("Clearing potentially corrupted storage and starting fresh.");
// // // // // //         localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // //         loadedGame = new Chess();
// // // // // //         loadedHistory = [];
// // // // // //         loadSource = "localStorage parse error fallback";
// // // // // //       }
// // // // // //     }

// // // // // //     // --- Set the final loaded/new game state ---
// // // // // //     setGame(loadedGame);
// // // // // //     setFen(loadedGame.fen());
// // // // // //     setMoveHistory(loadedHistory);
// // // // // //     updateGameStatus(loadedGame);
// // // // // //     setIsGameLoading(false);
// // // // // //     console.log(`Game loading complete. Source: ${loadSource}`);
// // // // // //   }, [initialFen, updateGameStatus]);


// // // // // //   // --- Core Game Logic (Unchanged) ---
// // // // // //   const makeMove = useCallback((move) => {
// // // // // //     if (!game) { console.warn("[makeMove] Attempted move before game loaded."); return false; }
// // // // // //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// // // // // //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Unexpected error during tempGame.move:", e); moveResult = null; }
// // // // // //     if (moveResult) {
// // // // // //       console.log(`[makeMove] Success: ${moveResult.san}`);
// // // // // //       setGame(tempGame); setFen(tempGame.fen());
// // // // // //       setMoveHistory((prev) => {
// // // // // //           const nextHistory = [...prev, moveResult.san];
// // // // // //           try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory)); console.log("Move history saved to local storage."); } catch (storageError) { console.error("Failed to save move history to local storage:", storageError); }
// // // // // //           return nextHistory;
// // // // // //       });
// // // // // //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
// // // // // //     } else { console.log("[makeMove] Failed (Illegal Move or Error):", move); success = false; }
// // // // // //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// // // // // //   }, [game, updateGameStatus, aiEnabled]);


// // // // // //   // --- react-chessboard Callbacks (Logical - Unchanged) ---
// // // // // //   const isDraggablePiece = useCallback(({ piece }) => {
// // // // // //     if (!game || game.isGameOver() || isGameLoading) return false;
// // // // // //     const pieceColor = piece[0];
// // // // // //     if (aiEnabled) { return game.turn() === playerColor.charAt(0) && pieceColor === playerColor.charAt(0); }
// // // // // //     else { return game.turn() === pieceColor; }
// // // // // //   }, [game, playerColor, aiEnabled, isGameLoading]);
// // // // // //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// // // // // //     if (!game || isGameLoading) return false;
// // // // // //     if (!piece || piece[1].toLowerCase() !== 'p') return false;
// // // // // //     return checkIsPromotion(sourceSquare, targetSquare);
// // // // // //   }, [checkIsPromotion, game, isGameLoading]);
// // // // // //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// // // // // //     if (!game || isGameLoading) return false;
// // // // // //     if (!piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// // // // // //     const promotionPiece = piece[1].toLowerCase(); const fromSq = promoteFromSquare ?? pendingManualPromotion?.from; const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// // // // // //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// // // // // //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// // // // // //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);
// // // // // //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// // // // // //     if (!game || isGameLoading) return false;
// // // // // //     const pieceColor = pieceString[0]; if (game.isGameOver() || (aiEnabled && game.turn() !== playerColor.charAt(0)) || (!aiEnabled && game.turn() !== pieceColor)) { return false; }
// // // // // //     const isPromo = checkIsPromotion(sourceSquare, targetSquare); if (isPromo) { return true; } else { const success = makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }); return success; }
// // // // // //   }, [game, playerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);
// // // // // //   const onSquareClick = useCallback((square) => {
// // // // // //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return; if (aiEnabled && game.turn() !== playerColor.charAt(0)) return;
// // // // // //     if (!selectedSquare) { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // // // //     } else { if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; } if (highlightedSquares.includes(square)) { const isPromo = checkIsPromotion(selectedSquare, square); if (isPromo) { setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true); setSelectedSquare(null); setHighlightedSquares([]); return; } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); } } else { const piece = game.get(square); if (piece && piece.color === game.turn()) { const moves = game.moves({ square: square, verbose: true }); if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); } else { setSelectedSquare(null); setHighlightedSquares([]); } } else { setSelectedSquare(null); setHighlightedSquares([]); } } }
// // // // // //   }, [game, selectedSquare, highlightedSquares, playerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


// // // // // //   // --- Control Button Functions (MODIFIED resetGame and undoMove) ---

// // // // // //   // **** MODIFIED: resetGame now respects initialFen ****
// // // // // //   const resetGame = useCallback(() => {
// // // // // //     console.log("Resetting game.");
// // // // // //     // Create a new game instance using the initialFen if provided, otherwise use the default start position.
// // // // // //     const newGame = initialFen ? new Chess(initialFen) : new Chess();
// // // // // //     console.log(`Resetting to FEN: ${newGame.fen()}`); // Log the FEN being reset to

// // // // // //     setGame(newGame);
// // // // // //     setFen(newGame.fen());
// // // // // //     setMoveHistory([]);
// // // // // //     setForwardMoves([]);
// // // // // //     setPauseAi(false);
// // // // // //     setIsAiThinking(false);
// // // // // //     setSelectedSquare(null);
// // // // // //     setHighlightedSquares([]);
// // // // // //     setPromotionDialogOpen(false);
// // // // // //     setPendingManualPromotion(null);
// // // // // //     updateGameStatus(newGame);

// // // // // //     // Clear history from local storage only if we weren't given an initial FEN (preserve localStorage if it matches default start)
// // // // // //     if (!initialFen) {
// // // // // //         try {
// // // // // //             localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // // //             console.log("Cleared local storage on reset (no initialFen).");
// // // // // //         } catch (e) {
// // // // // //             console.error("Failed to clear local storage on reset:", e);
// // // // // //         }
// // // // // //     } else {
// // // // // //         // If initialFen was provided, we clear storage during initialization anyway.
// // // // // //         // No need to clear it again here, prevents accidental clearing if user resets
// // // // // //         // a game that *happens* to match the default starting position but was loaded via prop.
// // // // // //         console.log("Local storage was handled during initial load with initialFen.");
// // // // // //     }

// // // // // //   // **** MODIFIED: Added initialFen to dependency array ****
// // // // // //   }, [updateGameStatus, initialFen]);

// // // // // //   // **** MODIFIED: undoMove now replays history from the correct starting FEN ****
// // // // // //   const undoMove = useCallback(() => {
// // // // // //     if (!game || isGameLoading || isAiThinking) return;
// // // // // //     const movesToUndo = aiEnabled ? 2 : 1;
// // // // // //     if (moveHistory.length < movesToUndo || game.isGameOver()) return;

// // // // // //     console.log(`[Undo] Undoing last ${movesToUndo} move(s).`);
// // // // // //     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
// // // // // //     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
// // // // // //     setForwardMoves((prev) => [...undoneMoves, ...prev]);

// // // // // //     // Recreate the game state by starting from the CORRECT initial position and replaying the shortened history
// // // // // //     // Use initialFen if it was provided, otherwise use the default start position.
// // // // // //     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
// // // // // //     console.log(`[Undo] Rebuilding game state from base FEN: ${baseGame.fen()}`);

// // // // // //     try {
// // // // // //         newHistory.forEach((san) => baseGame.move(san)); // Replay moves onto the correct base game
// // // // // //     } catch (e) {
// // // // // //         console.error("[Undo] Error replaying history:", e);
// // // // // //         // If replay fails, reset to the correct initial state (resetGame is now fixed)
// // // // // //         resetGame();
// // // // // //         return;
// // // // // //     }

// // // // // //     // Update state with the correctly reconstructed game
// // // // // //     setGame(baseGame);
// // // // // //     setFen(baseGame.fen());
// // // // // //     setMoveHistory(newHistory);

// // // // // //     // Save the updated (shorter) history to local storage
// // // // // //     try {
// // // // // //         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
// // // // // //         console.log("Updated history saved to local storage after undo.");
// // // // // //     } catch (storageError) {
// // // // // //         console.error("Failed to save history to local storage after undo:", storageError);
// // // // // //     }

// // // // // //     // Update AI state and UI elements
// // // // // //     if (aiEnabled) setPauseAi(true);
// // // // // //     setIsAiThinking(false);
// // // // // //     updateGameStatus(baseGame);
// // // // // //     setSelectedSquare(null);
// // // // // //     setHighlightedSquares([]);
// // // // // //     setPromotionDialogOpen(false);
// // // // // //     setPendingManualPromotion(null);

// // // // // //   // **** MODIFIED: Added initialFen to dependency array ****
// // // // // //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen]); // Added initialFen dependency

// // // // // //   // --- forwardMove (Unchanged - Already correctly uses current game state) ---
// // // // // //   const forwardMove = useCallback(() => {
// // // // // //     if (!game || isGameLoading || isAiThinking) return;
// // // // // //     const movesToRedo = aiEnabled ? 2 : 1;
// // // // // //     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;

// // // // // //     console.log(`[Redo] Redoing ${movesToRedo} move(s).`);
// // // // // //     const redoSANs = forwardMoves.slice(0, movesToRedo);
// // // // // //     const remainingForwardMoves = forwardMoves.slice(movesToRedo);

// // // // // //     // Create a temporary game state based on the *current* board position
// // // // // //     const tempGame = new Chess(game.fen());

// // // // // //     try {
// // // // // //         // Apply the moves to redo
// // // // // //         redoSANs.forEach(san => tempGame.move(san));
// // // // // //     } catch(e) {
// // // // // //         console.error("[Redo] Error replaying forward moves:", redoSANs, e);
// // // // // //         setForwardMoves([]); // Clear forward moves if error occurs
// // // // // //         return;
// // // // // //     }

// // // // // //     // Update state with the new game state after redoing moves
// // // // // //     const nextHistory = [...moveHistory, ...redoSANs];
// // // // // //     setGame(tempGame);
// // // // // //     setFen(tempGame.fen());
// // // // // //     setMoveHistory(nextHistory);

// // // // // //     // Save the updated (longer) history to local storage
// // // // // //     try {
// // // // // //         localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextHistory));
// // // // // //         console.log("Updated history saved to local storage after redo.");
// // // // // //     } catch (storageError) {
// // // // // //         console.error("Failed to save history to local storage after redo:", storageError);
// // // // // //     }

// // // // // //     // Update state variables
// // // // // //     setForwardMoves(remainingForwardMoves);
// // // // // //     updateGameStatus(tempGame);
// // // // // //     if (aiEnabled) setPauseAi(false); // Re-enable AI if it was paused by undo
// // // // // //     setIsAiThinking(false); // Ensure AI thinking state is reset
// // // // // //     setSelectedSquare(null);
// // // // // //     setHighlightedSquares([]);
// // // // // //     setPromotionDialogOpen(false);
// // // // // //     setPendingManualPromotion(null);
// // // // // //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking]); // No initialFen needed here


// // // // // //   // --- AI Logic (Unchanged) ---
// // // // // //   const fetchBestMove = useCallback(async (currentFen) => {
// // // // // //     const depth = 5; const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`; console.log("[fetchBestMove] Fetching AI move...");
// // // // // //     try { const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`); const data = await res.json(); if (data.success && data.bestmove) { const bestMoveString = data.bestmove.split(" ")[1]; const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4); const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined; console.log("[fetchBestMove] AI Move received:", { from, to, promotion }); return { from, to, promotion }; } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; } } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
// // // // // //   }, []);
// // // // // //   useEffect(() => {
// // // // // //     if (!game || game.isGameOver() || isGameLoading) return; const isAITurn = game.turn() !== playerColor.charAt(0); let timeoutId = null;
// // // // // //     if (aiEnabled && !pauseAi && isAITurn) {
// // // // // //       const currentFen = game.fen(); console.log("[AI Effect] AI turn detected. Scheduling fetch..."); setIsAiThinking(true);
// // // // // //       timeoutId = setTimeout(async () => {
// // // // // //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
// // // // // //         if (stillValidToFetch) {
// // // // // //           console.log("[AI Effect] Executing fetch for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
// // // // // //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== playerColor.charAt(0) && !game?.isGameOver();
// // // // // //           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); } else { console.log("[AI Effect] AI move aborted before applying (state changed during fetch or fetch failed)."); }
// // // // // //         } else { console.log("[AI Effect] AI move fetch aborted (state changed before timeout execution)."); }
// // // // // //         setIsAiThinking(false);
// // // // // //       }, 1000);
// // // // // //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking indicator."); setIsAiThinking(false); }
// // // // // //     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI move timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== playerColor.charAt(0)) { setIsAiThinking(false); } } };
// // // // // //   }, [fen, game, aiEnabled, pauseAi, playerColor, fetchBestMove, makeMove, isGameLoading]);


// // // // // //   // --- Auto-scroll Move History (Unchanged) ---
// // // // // //   useEffect(() => {
// // // // // //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// // // // // //   }, [moveHistory]);


// // // // // //   // --- Helper to generate custom square styles (Unchanged) ---
// // // // // //   const getCustomSquareStyles = useCallback(() => {
// // // // // //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// // // // // //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// // // // // //     if (selectedSquare) { styles[selectedSquare] = { ...(styles[selectedSquare] ?? {}), backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// // // // // //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// // // // // //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// // // // // //   // --- Render (Unchanged) ---
// // // // // //   return (
// // // // // //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// // // // // //       {/* --- Chessboard Area --- */}
// // // // // //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// // // // // //         {/* Header */}
// // // // // //         <Flex justify="space-between" align="center" mb={3} px={1}>
// // // // // //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// // // // // //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// // // // // //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// // // // // //               {statusText}
// // // // // //             </Text>
// // // // // //           </Flex>
// // // // // //           <HStack spacing={3} align="center" flexShrink={0}>
// // // // // //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// // // // // //               {aiEnabled ? "vs AI (Black)" : "Pass & Play"}
// // // // // //             </Text>
// // // // // //             <Switch
// // // // // //               id="ai-switch" colorScheme="teal" isChecked={aiEnabled}
// // // // // //               onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }}
// // // // // //               isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"
// // // // // //             />
// // // // // //           </HStack>
// // // // // //         </Flex>

// // // // // //         {/* The Chessboard Component */}
// // // // // //         {isGameLoading ? (
// // // // // //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// // // // // //                 <Text color={statusTextColor}>Loading Board...</Text>
// // // // // //             </Box>
// // // // // //         ) : (
// // // // // //             <Chessboard
// // // // // //               id="PlayerVsAiBoard"
// // // // // //               position={fen} // Uses the `fen` state variable
// // // // // //               isDraggablePiece={isDraggablePiece}
// // // // // //               onPieceDrop={onPieceDrop}
// // // // // //               onSquareClick={onSquareClick}
// // // // // //               onPromotionCheck={onPromotionCheck}
// // // // // //               onPromotionPieceSelect={handlePromotionPieceSelect}
// // // // // //               showPromotionDialog={promotionDialogOpen}
// // // // // //               promotionToSquare={pendingManualPromotion?.to ?? null}
// // // // // //               promotionDialogVariant="modal"
// // // // // //               boardOrientation={playerColor}
// // // // // //               boardWidth={420}
// // // // // //               customSquareStyles={getCustomSquareStyles()}
// // // // // //               customDarkSquareStyle={customDarkSquareStyle}
// // // // // //               customLightSquareStyle={customLightSquareStyle}
// // // // // //               snapToCursor={true}
// // // // // //               animationDuration={150}
// // // // // //             />
// // // // // //         )}
// // // // // //       </Box>

// // // // // //       {/* --- Sidebar Area (Unchanged) --- */}
// // // // // //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// // // // // //         {/* Controls Section */}
// // // // // //         <VStack align="stretch" spacing={3}>
// // // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// // // // // //              <HStack spacing={3}>
// // // // // //                {/* Button disable logic remains the same */}
// // // // // //                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
// // // // // //                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < (aiEnabled ? 2 : 1) || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
// // // // // //              </HStack>
// // // // // //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// // // // // //         </VStack>
// // // // // //         <Divider />

// // // // // //         {/* Move History Section */}
// // // // // //          <VStack align="stretch" spacing={2}>
// // // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// // // // // //             <Box
// // // // // //               ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// // // // // //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// // // // // //             >
// // // // // //               {isGameLoading ? (
// // // // // //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// // // // // //               ) : moveHistory.length === 0 ? (
// // // // // //                 <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// // // // // //                ) : (
// // // // // //                  <VStack spacing={1} align="stretch">
// // // // // //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
// // // // // //                         const moveNumber = i + 1; const whiteMoveIndex = i * 2; const blackMoveIndex = i * 2 + 1; const isLastWhite = whiteMoveIndex === moveHistory.length - 1; const isLastBlack = blackMoveIndex === moveHistory.length - 1;
// // // // // //                         return (
// // // // // //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// // // // // //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>
// // // // // //                              <Text minW="55px" px={1} fontWeight={isLastWhite ? 'extrabold': 'normal'} color={isLastWhite ? lastMoveColor : defaultMoveColor} title={`White move ${moveNumber}: ${moveHistory[whiteMoveIndex]}`}> {moveHistory[whiteMoveIndex] ?? ""} </Text>
// // // // // //                              <Text minW="55px" px={1} fontWeight={isLastBlack ? 'extrabold': 'normal'} color={isLastBlack ? lastMoveColor : defaultMoveColor} visibility={moveHistory[blackMoveIndex] ? 'visible' : 'hidden'} title={moveHistory[blackMoveIndex] ? `Black move ${moveNumber}: ${moveHistory[blackMoveIndex]}` : ''} > {moveHistory[blackMoveIndex] ?? ""} </Text>
// // // // // //                           </Flex>
// // // // // //                         )
// // // // // //                     })}
// // // // // //                  </VStack>
// // // // // //               )}
// // // // // //             </Box>
// // // // // //          </VStack>
// // // // // //       </VStack>
// // // // // //     </HStack>
// // // // // //   );
// // // // // // };

// // // // // // export default ChessGame;

// // // // // import React, { useState, useEffect, useCallback, useRef } from "react";
// // // // // import { Chess } from "chess.js"; // Ensure installed: npm install chess.js
// // // // // import { Chessboard } from "react-chessboard"; // Ensure installed: npm install react-chessboard
// // // // // import {
// // // // //   Box,
// // // // //   Text,
// // // // //   VStack,
// // // // //   Button,
// // // // //   HStack,
// // // // //   Divider,
// // // // //   useColorModeValue,
// // // // //   Flex,
// // // // //   Switch,
// // // // //   Spinner,
// // // // // } from "@chakra-ui/react"; // Ensure installed: npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

// // // // // // --- Local Storage Key ---
// // // // // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';

// // // // // // --- Helper Functions (Logical - Unchanged) ---
// // // // // const findKingSquareFn = (gameInstance) => {
// // // // //     if (!gameInstance) return null;
// // // // //     const board = gameInstance.board();
// // // // //     for (let r = 0; r < 8; r++) {
// // // // //       for (let c = 0; c < 8; c++) {
// // // // //         const piece = board[r][c];
// // // // //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// // // // //           return "abcdefgh"[c] + (8 - r);
// // // // //         }
// // // // //       }
// // // // //     }
// // // // //     return null;
// // // // // };
// // // // // const checkIsPromotionFn = (gameInstance, from, to) => {
// // // // //     if (!from || !to || !gameInstance) return false;
// // // // //     const piece = gameInstance.get(from);
// // // // //     if (!piece || piece.type !== 'p') return false;
// // // // //     const targetRank = to[1];
// // // // //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// // // // //     if (targetRank !== promotionRank) return false;
// // // // //     const moves = gameInstance.moves({ square: from, verbose: true });
// // // // //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // // // // };


// // // // // // --- Main Component ---
// // // // // const ChessGame = ({ initialFen }) => {
// // // // //   // --- State ---
// // // // //   const [game, setGame] = useState(null);
// // // // //   const [fen, setFen] = useState(initialFen || "start"); // Initial placeholder
// // // // //   const [moveHistory, setMoveHistory] = useState([]);
// // // // //   const [forwardMoves, setForwardMoves] = useState([]);
// // // // //   // **** MODIFIED: State to determine human player color dynamically ****
// // // // //   const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Default before load
// // // // //   const [aiEnabled, setAiEnabled] = useState(true);
// // // // //   const [pauseAi, setPauseAi] = useState(false);
// // // // //   const [isAiThinking, setIsAiThinking] = useState(false);
// // // // //   const [selectedSquare, setSelectedSquare] = useState(null);
// // // // //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// // // // //   const [statusText, setStatusText] = useState("Loading Game...");
// // // // //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// // // // //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// // // // //   const [isGameLoading, setIsGameLoading] = useState(true);

// // // // //   // --- Refs (Unchanged) ---
// // // // //   const moveHistoryRef = useRef(null);

// // // // //   // --- UI Styling Values (Unchanged) ---
// // // // //   const pageBg = useColorModeValue("gray.100", "gray.800");
// // // // //   const boardContainerBg = useColorModeValue("white", "gray.700");
// // // // //   const historyBg = useColorModeValue("white", "gray.700");
// // // // //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// // // // //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// // // // //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// // // // //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// // // // //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// // // // //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// // // // //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// // // // //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// // // // //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// // // // //   const lastMoveColor = useColorModeValue('black','white');
// // // // //   const defaultMoveColor = useColorModeValue(undefined, undefined);
// // // // //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// // // // //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// // // // //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// // // // //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// // // // //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// // // // //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// // // // //   // --- Utility Functions (Unchanged) ---
// // // // //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// // // // //   const updateGameStatus = useCallback((currentGame) => {
// // // // //     if (!currentGame) {
// // // // //         setStatusText("Game not loaded");
// // // // //         return;
// // // // //     }
// // // // //     let status = "";
// // // // //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// // // // //     else if (currentGame.isStalemate()) status = "Stalemate!";
// // // // //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// // // // //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// // // // //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// // // // //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// // // // //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// // // // //     setStatusText(status);
// // // // //   }, []);

// // // // //   // --- Load Game on Mount (MODIFIED to set player color based on turn) ---
// // // // //   useEffect(() => {
// // // // //     console.log("Attempting to initialize game state...");
// // // // //     let loadedGame = null;
// // // // //     let loadedHistory = [];
// // // // //     let loadSource = "";

// // // // //     // --- Priority 1: Use initialFen prop if provided ---
// // // // //     if (initialFen) {
// // // // //       loadSource = "initialFen prop";
// // // // //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// // // // //       try {
// // // // //         loadedGame = new Chess(initialFen);
// // // // //         if (!loadedGame || !loadedGame.fen()) {
// // // // //             throw new Error("Chess.js could not properly parse the provided FEN string.");
// // // // //         }
// // // // //         loadedHistory = [];
// // // // //         console.log("Successfully initialized game from initialFen.");
// // // // //         try {
// // // // //           localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // //           console.log("Cleared previous game history from local storage due to initialFen prop.");
// // // // //         } catch (storageError) {
// // // // //           console.error("Failed to clear local storage while handling initialFen:", storageError);
// // // // //         }
// // // // //       } catch (fenError) {
// // // // //         console.error(`**************************************************`);
// // // // //         console.error(`* ERROR: Invalid initialFen prop provided: "${initialFen}"`);
// // // // //         console.error(`* Error details: ${fenError.message}`);
// // // // //         console.error(`* Falling back to the standard initial chess position.`);
// // // // //         console.error(`**************************************************`);
// // // // //         loadedGame = new Chess(); // Fallback to default starting position
// // // // //         loadedHistory = [];
// // // // //         loadSource = "initialFen error fallback";
// // // // //       }
// // // // //     }
// // // // //     // --- Priority 2: Try loading from localStorage if no initialFen prop ---
// // // // //     else {
// // // // //       loadSource = "localStorage attempt";
// // // // //       console.log("No initialFen prop. Attempting to load game from local storage...");
// // // // //       try {
// // // // //         const storedHistoryString = localStorage.getItem(LOCAL_STORAGE_KEY);
// // // // //         if (storedHistoryString) {
// // // // //           console.log("Found stored history:", storedHistoryString);
// // // // //           const parsedHistory = JSON.parse(storedHistoryString);
// // // // //           if (Array.isArray(parsedHistory)) {
// // // // //             // **** Start from default position before replay if loading from storage ****
// // // // //             loadedGame = new Chess();
// // // // //             try {
// // // // //               parsedHistory.forEach(san => loadedGame.move(san));
// // // // //               console.log("Successfully replayed history from local storage.");
// // // // //               loadedHistory = parsedHistory;
// // // // //               loadSource = "localStorage success";
// // // // //             } catch (replayError) {
// // // // //               console.error("Error replaying stored history:", replayError);
// // // // //               console.warn("Stored history seems invalid. Clearing storage and starting fresh.");
// // // // //               localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // //               loadedGame = new Chess();
// // // // //               loadedHistory = [];
// // // // //               loadSource = "localStorage replay error fallback";
// // // // //             }
// // // // //           } else {
// // // // //             console.warn("Stored history is not an array. Clearing storage and starting fresh.");
// // // // //             localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // //             loadedGame = new Chess();
// // // // //             loadedHistory = [];
// // // // //             loadSource = "localStorage format error fallback";
// // // // //           }
// // // // //         } else {
// // // // //           console.log("No stored history found. Starting new game.");
// // // // //           loadedGame = new Chess();
// // // // //           loadedHistory = [];
// // // // //           loadSource = "localStorage empty fallback";
// // // // //         }
// // // // //       } catch (parseError) {
// // // // //         console.error("Error parsing stored history:", parseError);
// // // // //         console.warn("Clearing potentially corrupted storage and starting fresh.");
// // // // //         localStorage.removeItem(LOCAL_STORAGE_KEY);
// // // // //         loadedGame = new Chess();
// // // // //         loadedHistory = [];
// // // // //         loadSource = "localStorage parse error fallback";
// // // // //       }
// // // // //     }

// // // // //     // --- Set the final loaded/new game state ---
// // // // //     setGame(loadedGame);
// // // // //     setFen(loadedGame.fen());
// // // // //     setMoveHistory(loadedHistory);
// // // // //     updateGameStatus(loadedGame);

// // // // //     // **** MODIFIED: Determine and set human player color based on loaded game's turn ****
// // // // //     const currentTurn = loadedGame.turn(); // 'w' or 'b'
// // // // //     const playerIsWhite = initialFen
// // // // //       ? currentTurn === 'w' // If initial FEN, player is White if it's White's turn initially
// // // // //       : true; // If loading from history (or new game), assume player started as White
// // // // //               // If history exists, the current turn dictates AI/player, but board orientation
// // // // //               // should likely stick to White for consistency unless explicitly set otherwise.
// // // // //               // Let's refine this: The *current* turn determines who plays *now*.
// // // // //     const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // // //     setHumanPlayerColor(newHumanColor);
// // // // //     console.log(`Game loaded. Current Turn: ${currentTurn}. Human Player controls: ${newHumanColor}`);


// // // // //     setIsGameLoading(false);
// // // // //     console.log(`Game loading complete. Source: ${loadSource}`);
// // // // //   }, [initialFen, updateGameStatus]); // updateGameStatus is stable, initialFen triggers reload


// // // // //   // --- Core Game Logic (Unchanged) ---
// // // // //   const makeMove = useCallback((move) => {
// // // // //     if (!game) { console.warn("[makeMove] Attempted move before game loaded."); return false; }
// // // // //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// // // // //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Unexpected error during tempGame.move:", e); moveResult = null; }
// // // // //     if (moveResult) {
// // // // //       console.log(`[makeMove] Success: ${moveResult.san}`);
// // // // //       setGame(tempGame); setFen(tempGame.fen());
// // // // //       setMoveHistory((prev) => {
// // // // //           const nextHistory = [...prev, moveResult.san];
// // // // //           // Save history based on the *base* FEN (startpos or initialFen)
// // // // //           const storageKey = initialFen ? `${LOCAL_STORAGE_KEY}_${initialFen}` : LOCAL_STORAGE_KEY;
// // // // //           try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`Move history saved to local storage (${storageKey}).`); } catch (storageError) { console.error("Failed to save move history to local storage:", storageError); }
// // // // //           return nextHistory;
// // // // //       });
// // // // //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;

// // // // //       // **** MODIFIED: After a move, re-evaluate who the human player is based on the NEW turn ****
// // // // //       // This ensures the board orientation and controls switch correctly if needed (e.g., in Pass & Play)
// // // // //       // Although maybe not strictly necessary for AI vs Human as the roles are fixed after load?
// // // // //       // Let's keep it simple: Human color is fixed after initial load for AI mode.
// // // // //       // If we wanted Pass & Play board flipping, we'd update humanPlayerColor here.
// // // // //       // setHumanPlayerColor(tempGame.turn() === 'w' ? 'white' : 'black'); // <-- Uncomment for Pass & Play flip

// // // // //     } else { console.log("[makeMove] Failed (Illegal Move or Error):", move); success = false; }
// // // // //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// // // // //   // **** MODIFIED: Added initialFen to dependency array for localStorage key logic ****
// // // // //   }, [game, updateGameStatus, aiEnabled, initialFen]); // Added initialFen


// // // // //   // --- react-chessboard Callbacks (MODIFIED to use humanPlayerColor) ---
// // // // //   const isDraggablePiece = useCallback(({ piece }) => {
// // // // //     if (!game || game.isGameOver() || isGameLoading) return false;
// // // // //     const pieceColor = piece[0]; // 'w' or 'b'
// // // // //     const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';

// // // // //     if (aiEnabled) {
// // // // //         // AI Mode: Only draggable if it's the human's turn AND the piece belongs to the human
// // // // //         const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// // // // //         const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
// // // // //         // console.log(`[isDraggablePiece] AI Mode. Piece: ${piece}, Turn: ${game.turn()}, Human: ${humanPlayerColor}, IsHumanTurn: ${isHumanTurn}, IsHumanPiece: ${isHumanPiece}`);
// // // // //         return isHumanTurn && isHumanPiece;
// // // // //     } else {
// // // // //         // Pass & Play Mode: Draggable if it's that piece color's turn
// // // // //         return game.turn() === pieceColor;
// // // // //     }
// // // // //   // **** MODIFIED: Added humanPlayerColor dependency ****
// // // // //   }, [game, aiEnabled, isGameLoading, humanPlayerColor]);

// // // // //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// // // // //     if (!game || isGameLoading) return false;
// // // // //     if (!piece || piece[1].toLowerCase() !== 'p') return false;
// // // // //     return checkIsPromotion(sourceSquare, targetSquare);
// // // // //   }, [checkIsPromotion, game, isGameLoading]);

// // // // //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// // // // //     if (!game || isGameLoading) return false;
// // // // //     if (!piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// // // // //     const promotionPiece = piece[1].toLowerCase(); const fromSq = promoteFromSquare ?? pendingManualPromotion?.from; const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// // // // //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// // // // //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// // // // //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

// // // // //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// // // // //     if (!game || isGameLoading) return false;

// // // // //     const pieceColor = pieceString[0]; // 'w' or 'b'
// // // // //     const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);

// // // // //     // Check if the move is allowed based on game state and mode
// // // // //     if (game.isGameOver()) {
// // // // //       console.log("[onPieceDrop] Drop prevented. Game Over.");
// // // // //       return false;
// // // // //     }
// // // // //     if (aiEnabled && !isHumanTurn) {
// // // // //       console.log(`[onPieceDrop] Drop prevented. AI Mode, not human's turn (Turn: ${game.turn()}, Human: ${humanPlayerColor})`);
// // // // //       return false;
// // // // //     }
// // // // //     if (!aiEnabled && game.turn() !== pieceColor) {
// // // // //        console.log(`[onPieceDrop] Drop prevented. Pass&Play Mode, not ${pieceColor}'s turn.`);
// // // // //        return false;
// // // // //     }

// // // // //     // If checks pass, attempt the move
// // // // //     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
// // // // //     if (isPromo) {
// // // // //       // Let the promotion dialog handle the move by returning true
// // // // //       return true;
// // // // //     } else {
// // // // //       const success = makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' }); // Default promotion for non-promo moves
// // // // //       return success;
// // // // //     }
// // // // //   // **** MODIFIED: Added humanPlayerColor dependency ****
// // // // //   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

// // // // //   const onSquareClick = useCallback((square) => {
// // // // //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;

// // // // //     // Prevent clicks if it's AI's turn in AI mode
// // // // //     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) {
// // // // //         // console.log("[onSquareClick] Click ignored (Not human's turn)");
// // // // //         return;
// // // // //     }

// // // // //     // --- Rest of the logic remains the same, checks game.turn() internally ---
// // // // //     if (!selectedSquare) {
// // // // //         const piece = game.get(square);
// // // // //         // Allow selecting only pieces of the current player to move
// // // // //         if (piece && piece.color === game.turn()) {
// // // // //             const moves = game.moves({ square: square, verbose: true });
// // // // //             if (moves.length > 0) {
// // // // //                 setSelectedSquare(square);
// // // // //                 setHighlightedSquares(moves.map((m) => m.to));
// // // // //             } else {
// // // // //                 setSelectedSquare(null);
// // // // //                 setHighlightedSquares([]);
// // // // //             }
// // // // //         } else {
// // // // //             setSelectedSquare(null);
// // // // //             setHighlightedSquares([]);
// // // // //         }
// // // // //     } else {
// // // // //         if (square === selectedSquare) { // Clicked selected square again
// // // // //             setSelectedSquare(null);
// // // // //             setHighlightedSquares([]);
// // // // //             return;
// // // // //         }
// // // // //         if (highlightedSquares.includes(square)) { // Clicked a legal move target
// // // // //             const isPromo = checkIsPromotion(selectedSquare, square);
// // // // //             if (isPromo) {
// // // // //                 setPendingManualPromotion({ from: selectedSquare, to: square });
// // // // //                 setPromotionDialogOpen(true);
// // // // //                 setSelectedSquare(null); // Clear selection while dialog is open
// // // // //                 setHighlightedSquares([]);
// // // // //                 return; // Let promotion handler make the move
// // // // //             } else {
// // // // //                 makeMove({ from: selectedSquare, to: square, promotion: 'q' }); // Make the regular move
// // // // //             }
// // // // //         } else { // Clicked a different square (not a legal move)
// // // // //             const piece = game.get(square);
// // // // //             // Check if it's another piece of the current player
// // // // //             if (piece && piece.color === game.turn()) {
// // // // //                 const moves = game.moves({ square: square, verbose: true });
// // // // //                 if (moves.length > 0) { // Select the new piece
// // // // //                     setSelectedSquare(square);
// // // // //                     setHighlightedSquares(moves.map((m) => m.to));
// // // // //                 } else { // Clicked own piece with no moves
// // // // //                     setSelectedSquare(null);
// // // // //                     setHighlightedSquares([]);
// // // // //                 }
// // // // //             } else { // Clicked empty square or opponent piece (not a legal target)
// // // // //                 setSelectedSquare(null);
// // // // //                 setHighlightedSquares([]);
// // // // //             }
// // // // //         }
// // // // //     }
// // // // //   // **** MODIFIED: Added humanPlayerColor dependency ****
// // // // //   }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


// // // // //   // --- Control Button Functions (MODIFIED resetGame and undoMove) ---
// // // // //   const resetGame = useCallback(() => {
// // // // //     console.log("Resetting game.");
// // // // //     // Create a new game instance using the initialFen if provided, otherwise use the default start position.
// // // // //     const newGame = initialFen ? new Chess(initialFen) : new Chess();
// // // // //     const newFen = newGame.fen();
// // // // //     console.log(`Resetting to FEN: ${newFen}`);

// // // // //     // **** MODIFIED: Determine player color based on reset state ****
// // // // //     const currentTurn = newGame.turn();
// // // // //     const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // // //     setHumanPlayerColor(newHumanColor);
// // // // //     console.log(`Game reset. Current Turn: ${currentTurn}. Human Player controls: ${newHumanColor}`);

// // // // //     setGame(newGame);
// // // // //     setFen(newFen);
// // // // //     setMoveHistory([]);
// // // // //     setForwardMoves([]);
// // // // //     setPauseAi(false);
// // // // //     setIsAiThinking(false);
// // // // //     setSelectedSquare(null);
// // // // //     setHighlightedSquares([]);
// // // // //     setPromotionDialogOpen(false);
// // // // //     setPendingManualPromotion(null);
// // // // //     updateGameStatus(newGame);

// // // // //     // Clear appropriate local storage
// // // // //     const storageKey = initialFen ? `${LOCAL_STORAGE_KEY}_${initialFen}` : LOCAL_STORAGE_KEY;
// // // // //     try {
// // // // //         localStorage.removeItem(storageKey);
// // // // //         console.log(`Cleared local storage on reset (${storageKey}).`);
// // // // //     } catch (e) {
// // // // //         console.error("Failed to clear local storage on reset:", e);
// // // // //     }

// // // // //   }, [updateGameStatus, initialFen]); // Dependency on initialFen is correct

// // // // //   const undoMove = useCallback(() => {
// // // // //     if (!game || isGameLoading || isAiThinking) return;
// // // // //     // Determine number of half-moves to undo (1 for P&P, 2 for vs AI unless it's the very first move)
// // // // //     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
// // // // //     if (moveHistory.length < movesToUndo || game.isGameOver()) return;

// // // // //     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
// // // // //     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
// // // // //     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
// // // // //     setForwardMoves((prev) => [...undoneMoves, ...prev]);

// // // // //     // Recreate the game state by starting from the correct initial position and replaying the shortened history
// // // // //     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
// // // // //     console.log(`[Undo] Rebuilding game state from base FEN: ${baseGame.fen()}`);

// // // // //     try {
// // // // //         newHistory.forEach((san) => baseGame.move(san)); // Replay moves onto the correct base game
// // // // //     } catch (e) {
// // // // //         console.error("[Undo] Error replaying history:", e);
// // // // //         resetGame(); // Reset to the correct initial state
// // // // //         return;
// // // // //     }

// // // // //     // Update state with the correctly reconstructed game
// // // // //     const currentTurn = baseGame.turn();
// // // // //     const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // // //     setHumanPlayerColor(newHumanColor); // Update player color based on the undone state
// // // // //     console.log(`[Undo] State restored. Current Turn: ${currentTurn}. Human Player controls: ${newHumanColor}`);

// // // // //     setGame(baseGame);
// // // // //     setFen(baseGame.fen());
// // // // //     setMoveHistory(newHistory);

// // // // //     // Save the updated (shorter) history to local storage
// // // // //     const storageKey = initialFen ? `${LOCAL_STORAGE_KEY}_${initialFen}` : LOCAL_STORAGE_KEY;
// // // // //     try {
// // // // //         localStorage.setItem(storageKey, JSON.stringify(newHistory));
// // // // //         console.log(`Updated history saved to local storage after undo (${storageKey}).`);
// // // // //     } catch (storageError) {
// // // // //         console.error("Failed to save history to local storage after undo:", storageError);
// // // // //     }

// // // // //     // Update AI state and UI elements
// // // // //     if (aiEnabled) setPauseAi(true); // Pause AI after undoing its move
// // // // //     setIsAiThinking(false);
// // // // //     updateGameStatus(baseGame);
// // // // //     setSelectedSquare(null);
// // // // //     setHighlightedSquares([]);
// // // // //     setPromotionDialogOpen(false);
// // // // //     setPendingManualPromotion(null);

// // // // //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen]); // Added initialFen dependency

// // // // //   const forwardMove = useCallback(() => {
// // // // //     if (!game || isGameLoading || isAiThinking) return;
// // // // //      // Determine number of half-moves to redo (1 for P&P, 2 for vs AI unless only 1 move available)
// // // // //     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
// // // // //     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;

// // // // //     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
// // // // //     const redoSANs = forwardMoves.slice(0, movesToRedo);
// // // // //     const remainingForwardMoves = forwardMoves.slice(movesToRedo);

// // // // //     // Create a temporary game state based on the *current* board position
// // // // //     const tempGame = new Chess(game.fen());

// // // // //     try {
// // // // //         redoSANs.forEach(san => tempGame.move(san));
// // // // //     } catch(e) {
// // // // //         console.error("[Redo] Error replaying forward moves:", redoSANs, e);
// // // // //         setForwardMoves([]); // Clear forward moves if error occurs
// // // // //         return;
// // // // //     }

// // // // //     // Update state with the new game state after redoing moves
// // // // //     const nextHistory = [...moveHistory, ...redoSANs];
// // // // //     const currentTurn = tempGame.turn();
// // // // //     const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // // //     setHumanPlayerColor(newHumanColor); // Update player color based on the redone state
// // // // //     console.log(`[Redo] State advanced. Current Turn: ${currentTurn}. Human Player controls: ${newHumanColor}`);

// // // // //     setGame(tempGame);
// // // // //     setFen(tempGame.fen());
// // // // //     setMoveHistory(nextHistory);

// // // // //     // Save the updated (longer) history to local storage
// // // // //     const storageKey = initialFen ? `${LOCAL_STORAGE_KEY}_${initialFen}` : LOCAL_STORAGE_KEY;
// // // // //     try {
// // // // //         localStorage.setItem(storageKey, JSON.stringify(nextHistory));
// // // // //         console.log(`Updated history saved to local storage after redo (${storageKey}).`);
// // // // //     } catch (storageError) {
// // // // //         console.error("Failed to save history to local storage after redo:", storageError);
// // // // //     }

// // // // //     // Update state variables
// // // // //     setForwardMoves(remainingForwardMoves);
// // // // //     updateGameStatus(tempGame);
// // // // //     if (aiEnabled) setPauseAi(false); // Re-enable AI if it was paused by undo
// // // // //     setIsAiThinking(false);
// // // // //     setSelectedSquare(null);
// // // // //     setHighlightedSquares([]);
// // // // //     setPromotionDialogOpen(false);
// // // // //     setPendingManualPromotion(null);
// // // // //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen]); // Added initialFen dependency


// // // // //   // --- AI Logic (MODIFIED to use humanPlayerColor) ---
// // // // //   const fetchBestMove = useCallback(async (currentFen) => {
// // // // //     // Ensure depth is reasonable, Stockfish Online might have limits
// // // // //     const depth = 4; // Reduced depth slightly for potentially faster response
// // // // //     const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
// // // // //     console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
// // // // //     try {
// // // // //         const res = await fetch(url);
// // // // //         if (!res.ok) throw new Error(`API error: ${res.status}`);
// // // // //         const data = await res.json();
// // // // //         // Check structure carefully
// // // // //         if (data.success && data.bestmove && typeof data.bestmove === 'string') {
// // // // //             // Expected format: "bestmove e2e4 ponder a7a6" or similar
// // // // //             const bestMoveString = data.bestmove.split(" ")[1]; // Get the actual move part
// // // // //             if (bestMoveString && bestMoveString.length >= 4) {
// // // // //               const from = bestMoveString.slice(0, 2);
// // // // //               const to = bestMoveString.slice(2, 4);
// // // // //               const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
// // // // //               console.log("[fetchBestMove] AI Move received:", { from, to, promotion });
// // // // //               return { from, to, promotion };
// // // // //             } else {
// // // // //                console.error("[fetchBestMove] Invalid bestmove format in API response:", data.bestmove);
// // // // //                return null;
// // // // //             }
// // // // //         } else {
// // // // //             console.error("[fetchBestMove] Stockfish API error or unexpected response:", data);
// // // // //             return null;
// // // // //         }
// // // // //     } catch (err) {
// // // // //         console.error("[fetchBestMove] Network/API fetch error:", err);
// // // // //         return null;
// // // // //     }
// // // // //   }, []); // No dependencies needed

// // // // //   useEffect(() => {
// // // // //     if (!game || game.isGameOver() || isGameLoading) return;

// // // // //     // **** MODIFIED: Determine AI's turn based on humanPlayerColor ****
// // // // //     const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
// // // // //     let timeoutId = null;

// // // // //     if (aiEnabled && !pauseAi && isAITurn) {
// // // // //       const currentFen = game.fen();
// // // // //       console.log(`[AI Effect] AI turn (${game.turn()}) detected. Scheduling fetch...`);
// // // // //       setIsAiThinking(true); // Indicate AI is thinking

// // // // //       timeoutId = setTimeout(async () => {
// // // // //         // Re-check conditions before fetching, state might have changed
// // // // //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();

// // // // //         if (stillValidToFetch) {
// // // // //           console.log("[AI Effect] Executing fetch for FEN:", currentFen);
// // // // //           const bestMove = await fetchBestMove(currentFen);

// // // // //           // Re-check conditions *after* fetch returns, before applying the move
// // // // //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();

// // // // //           if (bestMove && stillValidToApply) {
// // // // //             console.log("[AI Effect] Applying AI move:", bestMove);
// // // // //             makeMove(bestMove); // makeMove will handle state updates including fen and status
// // // // //           } else {
// // // // //              if (!bestMove) console.log("[AI Effect] AI move aborted (Fetch failed or returned null).");
// // // // //              else console.log("[AI Effect] AI move aborted before applying (State changed during fetch).");
// // // // //           }
// // // // //         } else {
// // // // //           console.log("[AI Effect] AI move fetch aborted (State changed before timeout execution).");
// // // // //         }

// // // // //         // Ensure thinking indicator stops even if aborted
// // // // //         setIsAiThinking(false);
// // // // //       }, 1000); // Delay before AI moves
// // // // //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) {
// // // // //         // If conditions change while AI was thinking (e.g., user disabled AI, paused, or undid move)
// // // // //         console.log("[AI Effect] Conditions changed, stopping AI thinking indicator.");
// // // // //         setIsAiThinking(false);
// // // // //     }

// // // // //     // Cleanup function to clear timeout if component unmounts or dependencies change
// // // // //     return () => {
// // // // //       if (timeoutId) {
// // // // //         console.log("[AI Effect Cleanup] Clearing AI move timeout.");
// // // // //         clearTimeout(timeoutId);
// // // // //         // Optionally reset thinking state immediately on cleanup if AI was active
// // // // //         if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) {
// // // // //            setIsAiThinking(false);
// // // // //         }
// // // // //       }
// // // // //     };
// // // // //   // **** MODIFIED: Added humanPlayerColor dependency ****
// // // // //   }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


// // // // //   // --- Auto-scroll Move History (Unchanged) ---
// // // // //   useEffect(() => {
// // // // //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// // // // //   }, [moveHistory]);


// // // // //   // --- Helper to generate custom square styles (Unchanged) ---
// // // // //   const getCustomSquareStyles = useCallback(() => {
// // // // //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// // // // //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// // // // //     if (selectedSquare) { styles[selectedSquare] = { ...(styles[selectedSquare] ?? {}), backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// // // // //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// // // // //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// // // // //   // --- Render (MODIFIED boardOrientation and AI status text) ---
// // // // //   return (
// // // // //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// // // // //       {/* --- Chessboard Area --- */}
// // // // //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// // // // //         {/* Header */}
// // // // //         <Flex justify="space-between" align="center" mb={3} px={1}>
// // // // //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// // // // //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// // // // //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// // // // //               {isGameLoading ? "Loading Game..." : statusText}
// // // // //             </Text>
// // // // //           </Flex>
// // // // //           <HStack spacing={3} align="center" flexShrink={0}>
// // // // //             {/* **** MODIFIED: Display correct AI color **** */}
// // // // //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// // // // //               {aiEnabled
// // // // //                 ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})`
// // // // //                 : "Pass & Play"}
// // // // //             </Text>
// // // // //             <Switch
// // // // //               id="ai-switch" colorScheme="teal" isChecked={aiEnabled}
// // // // //               onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }}
// // // // //               isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"
// // // // //             />
// // // // //           </HStack>
// // // // //         </Flex>

// // // // //         {/* The Chessboard Component */}
// // // // //         {isGameLoading ? (
// // // // //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// // // // //                 <Text color={statusTextColor}>Loading Board...</Text>
// // // // //             </Box>
// // // // //         ) : (
// // // // //             <Chessboard
// // // // //               id="PlayerVsAiBoard"
// // // // //               position={fen}
// // // // //               isDraggablePiece={isDraggablePiece}
// // // // //               onPieceDrop={onPieceDrop}
// // // // //               onSquareClick={onSquareClick}
// // // // //               onPromotionCheck={onPromotionCheck}
// // // // //               onPromotionPieceSelect={handlePromotionPieceSelect}
// // // // //               showPromotionDialog={promotionDialogOpen}
// // // // //               promotionToSquare={pendingManualPromotion?.to ?? null}
// // // // //               promotionDialogVariant="modal"
// // // // //               // **** MODIFIED: Use dynamic player color for orientation ****
// // // // //               boardOrientation={humanPlayerColor}
// // // // //               boardWidth={420}
// // // // //               customSquareStyles={getCustomSquareStyles()}
// // // // //               customDarkSquareStyle={customDarkSquareStyle}
// // // // //               customLightSquareStyle={customLightSquareStyle}
// // // // //               snapToCursor={true}
// // // // //               animationDuration={150} // Consider slightly longer if needed for flip animation feel
// // // // //             />
// // // // //         )}
// // // // //       </Box>

// // // // //       {/* --- Sidebar Area (MODIFIED Undo/Redo disable logic slightly) --- */}
// // // // //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// // // // //         {/* Controls Section */}
// // // // //         <VStack align="stretch" spacing={3}>
// // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// // // // //              <HStack spacing={3}>
// // // // //                {/* **** MODIFIED: Refined disable logic for undo/redo with AI **** */}
// // // // //                <Button
// // // // //                  colorScheme="orange" variant="outline" onClick={undoMove}
// // // // //                  isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || (aiEnabled && moveHistory.length < 1) || game?.isGameOver()} // Can always undo at least 1 move unless AI just moved
// // // // //                  size="sm" flexGrow={1}
// // // // //                >
// // // // //                  Undo
// // // // //                </Button>
// // // // //                <Button
// // // // //                   colorScheme="cyan" variant="outline" onClick={forwardMove}
// // // // //                   isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || (aiEnabled && forwardMoves.length < (forwardMoves.length > 0 && forwardMoves.length % 2 !== 0 ? 1: 2) ) || game?.isGameOver()} // Can redo if moves exist
// // // // //                   size="sm" flexGrow={1}
// // // // //                >
// // // // //                  Redo
// // // // //                </Button>

// // // // //              </HStack>
// // // // //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// // // // //         </VStack>
// // // // //         <Divider />

// // // // //         {/* Move History Section (Unchanged Rendering Logic) */}
// // // // //          <VStack align="stretch" spacing={2}>
// // // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// // // // //             <Box
// // // // //               ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// // // // //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// // // // //             >
// // // // //               {isGameLoading ? (
// // // // //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// // // // //               ) : moveHistory.length === 0 ? (
// // // // //                 <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// // // // //                ) : (
// // // // //                  <VStack spacing={1} align="stretch">
// // // // //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
// // // // //                         const moveNumber = i + 1; const whiteMoveIndex = i * 2; const blackMoveIndex = i * 2 + 1; const isLastWhite = whiteMoveIndex === moveHistory.length - 1; const isLastBlack = blackMoveIndex === moveHistory.length - 1;
// // // // //                         return (
// // // // //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// // // // //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>
// // // // //                              <Text minW="55px" px={1} fontWeight={isLastWhite ? 'extrabold': 'normal'} color={isLastWhite ? lastMoveColor : defaultMoveColor} title={`White move ${moveNumber}: ${moveHistory[whiteMoveIndex]}`}> {moveHistory[whiteMoveIndex] ?? ""} </Text>
// // // // //                              <Text minW="55px" px={1} fontWeight={isLastBlack ? 'extrabold': 'normal'} color={isLastBlack ? lastMoveColor : defaultMoveColor} visibility={moveHistory[blackMoveIndex] ? 'visible' : 'hidden'} title={moveHistory[blackMoveIndex] ? `Black move ${moveNumber}: ${moveHistory[blackMoveIndex]}` : ''} > {moveHistory[blackMoveIndex] ?? ""} </Text>
// // // // //                           </Flex>
// // // // //                         )
// // // // //                     })}
// // // // //                  </VStack>
// // // // //               )}
// // // // //             </Box>
// // // // //          </VStack>
// // // // //       </VStack>
// // // // //     </HStack>
// // // // //   );
// // // // // };

// // // // // export default ChessGame;
// // // // import React, { useState, useEffect, useCallback, useRef } from "react";
// // // // import { Chess } from "chess.js";
// // // // import { Chessboard } from "react-chessboard";
// // // // import {
// // // //   Box,
// // // //   Text,
// // // //   VStack,
// // // //   Button,
// // // //   HStack,
// // // //   Divider,
// // // //   useColorModeValue,
// // // //   Flex,
// // // //   Switch,
// // // //   Spinner,
// // // // } from "@chakra-ui/react";

// // // // // --- Local Storage Key ---
// // // // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';
// // // // // Helper function to get the appropriate storage key based on FEN
// // // // const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;


// // // // // --- Helper Functions (Logical - Unchanged) ---
// // // // const findKingSquareFn = (gameInstance) => {
// // // //     // ... (no changes needed)
// // // //     if (!gameInstance) return null;
// // // //     const board = gameInstance.board();
// // // //     for (let r = 0; r < 8; r++) {
// // // //       for (let c = 0; c < 8; c++) {
// // // //         const piece = board[r][c];
// // // //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// // // //           return "abcdefgh"[c] + (8 - r);
// // // //         }
// // // //       }
// // // //     }
// // // //     return null;
// // // // };
// // // // const checkIsPromotionFn = (gameInstance, from, to) => {
// // // //     // ... (no changes needed)
// // // //     if (!from || !to || !gameInstance) return false;
// // // //     const piece = gameInstance.get(from);
// // // //     if (!piece || piece.type !== 'p') return false;
// // // //     const targetRank = to[1];
// // // //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// // // //     if (targetRank !== promotionRank) return false;
// // // //     const moves = gameInstance.moves({ square: from, verbose: true });
// // // //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // // // };


// // // // // --- Main Component ---
// // // // const ChessGame = ({ initialFen }) => {
// // // //   // --- State ---
// // // //   const [game, setGame] = useState(null);
// // // //   const [fen, setFen] = useState(initialFen || "start");
// // // //   const [moveHistory, setMoveHistory] = useState([]);
// // // //   const [forwardMoves, setForwardMoves] = useState([]);
// // // //   // **** MODIFIED: Player color is now determined once on load and stays fixed ****
// // // //   const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Default before load
// // // //   const [aiEnabled, setAiEnabled] = useState(true);
// // // //   const [pauseAi, setPauseAi] = useState(false);
// // // //   const [isAiThinking, setIsAiThinking] = useState(false);
// // // //   const [selectedSquare, setSelectedSquare] = useState(null);
// // // //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// // // //   const [statusText, setStatusText] = useState("Loading Game...");
// // // //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// // // //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// // // //   const [isGameLoading, setIsGameLoading] = useState(true);

// // // //   // --- Refs (Unchanged) ---
// // // //   const moveHistoryRef = useRef(null);

// // // //   // --- UI Styling Values (Unchanged) ---
// // // //   const pageBg = useColorModeValue("gray.100", "gray.800");
// // // //   const boardContainerBg = useColorModeValue("white", "gray.700");
// // // //   const historyBg = useColorModeValue("white", "gray.700");
// // // //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// // // //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// // // //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// // // //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// // // //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// // // //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// // // //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// // // //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// // // //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// // // //   const lastMoveColor = useColorModeValue('black','white');
// // // //   const defaultMoveColor = useColorModeValue("gray.700", "gray.300"); // Slightly adjusted for visibility
// // // //   const placeholderMoveColor = useColorModeValue("gray.400", "gray.500"); // Color for "..."
// // // //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// // // //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// // // //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// // // //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// // // //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// // // //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// // // //   // --- Utility Functions (Unchanged) ---
// // // //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// // // //   const updateGameStatus = useCallback((currentGame) => {
// // // //     // ... (no changes needed)
// // // //     if (!currentGame) {
// // // //         setStatusText("Game not loaded");
// // // //         return;
// // // //     }
// // // //     let status = "";
// // // //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// // // //     else if (currentGame.isStalemate()) status = "Stalemate!";
// // // //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// // // //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// // // //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// // // //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// // // //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// // // //     setStatusText(status);
// // // //   }, []);

// // // //   // --- Load Game on Mount (Sets fixed player color) ---
// // // //   useEffect(() => {
// // // //     console.log("Attempting to initialize game state...");
// // // //     let loadedGame = null;
// // // //     let loadedHistory = [];
// // // //     let loadSource = "";
// // // //     const storageKey = getStorageKey(initialFen); // Determine storage key early

// // // //     // --- Priority 1: Use initialFen prop if provided ---
// // // //     if (initialFen) {
// // // //       loadSource = "initialFen prop";
// // // //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// // // //       try {
// // // //         loadedGame = new Chess(initialFen);
// // // //         if (!loadedGame || !loadedGame.fen()) {
// // // //             throw new Error("Chess.js could not properly parse the provided FEN string.");
// // // //         }
// // // //         loadedHistory = []; // Start with empty history for a specific FEN
// // // //         console.log("Successfully initialized game from initialFen.");
// // // //         // Clear storage *specific* to this FEN if it exists
// // // //         try {
// // // //           localStorage.removeItem(storageKey);
// // // //           console.log(`Cleared previous game history from local storage (${storageKey}) due to initialFen prop.`);
// // // //         } catch (storageError) {
// // // //           console.error("Failed to clear local storage while handling initialFen:", storageError);
// // // //         }
// // // //       } catch (fenError) {
// // // //         console.error(`ERROR: Invalid initialFen prop provided: "${initialFen}". Error: ${fenError.message}. Falling back to default.`);
// // // //         loadedGame = new Chess(); // Fallback to default starting position
// // // //         loadedHistory = [];
// // // //         loadSource = "initialFen error fallback";
// // // //       }
// // // //     }
// // // //     // --- Priority 2: Try loading from localStorage if no initialFen prop ---
// // // //     else {
// // // //       loadSource = "localStorage attempt (default key)";
// // // //       console.log("No initialFen prop. Attempting to load game from local storage (default key)...");
// // // //       try {
// // // //         const storedHistoryString = localStorage.getItem(storageKey); // Use default key
// // // //         if (storedHistoryString) {
// // // //           console.log("Found stored history:", storedHistoryString);
// // // //           const parsedHistory = JSON.parse(storedHistoryString);
// // // //           if (Array.isArray(parsedHistory)) {
// // // //             loadedGame = new Chess(); // Start fresh before replaying
// // // //             try {
// // // //               parsedHistory.forEach(san => loadedGame.move(san));
// // // //               console.log("Successfully replayed history from local storage.");
// // // //               loadedHistory = parsedHistory;
// // // //               loadSource = "localStorage success";
// // // //             } catch (replayError) {
// // // //               console.error("Error replaying stored history:", replayError);
// // // //               console.warn("Stored history seems invalid. Clearing storage and starting fresh.");
// // // //               localStorage.removeItem(storageKey);
// // // //               loadedGame = new Chess();
// // // //               loadedHistory = [];
// // // //               loadSource = "localStorage replay error fallback";
// // // //             }
// // // //           } else {
// // // //             console.warn("Stored history is not an array. Clearing storage and starting fresh.");
// // // //             localStorage.removeItem(storageKey);
// // // //             loadedGame = new Chess();
// // // //             loadedHistory = [];
// // // //             loadSource = "localStorage format error fallback";
// // // //           }
// // // //         } else {
// // // //           console.log("No stored history found. Starting new game.");
// // // //           loadedGame = new Chess();
// // // //           loadedHistory = [];
// // // //           loadSource = "localStorage empty fallback";
// // // //         }
// // // //       } catch (parseError) {
// // // //         console.error("Error parsing stored history:", parseError);
// // // //         console.warn("Clearing potentially corrupted storage and starting fresh.");
// // // //         localStorage.removeItem(storageKey);
// // // //         loadedGame = new Chess();
// // // //         loadedHistory = [];
// // // //         loadSource = "localStorage parse error fallback";
// // // //       }
// // // //     }

// // // //     // --- Set game state ---
// // // //     setGame(loadedGame);
// // // //     setFen(loadedGame.fen());
// // // //     setMoveHistory(loadedHistory);
// // // //     updateGameStatus(loadedGame);

// // // //     // **** MODIFIED: Determine and SET human player color ONCE based on loaded game's turn ****
// // // //     const initialTurn = loadedGame.turn(); // 'w' or 'b'
// // // //     const playerColor = initialTurn === 'w' ? 'white' : 'black';
// // // //     setHumanPlayerColor(playerColor); // Set it here and DO NOT change later
// // // //     console.log(`Game loaded. Initial Turn: ${initialTurn}. Human Player controls: ${playerColor}. Board orientation set.`);

// // // //     setIsGameLoading(false);
// // // //     console.log(`Game loading complete. Source: ${loadSource}`);
// // // //     // Only depend on initialFen (for reloading if prop changes) and updateGameStatus (stable)
// // // //   }, [initialFen, updateGameStatus]);


// // // //   // --- Core Game Logic (No longer changes humanPlayerColor) ---
// // // //   const makeMove = useCallback((move) => {
// // // //     if (!game) { console.warn("[makeMove] Attempted move before game loaded."); return false; }
// // // //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// // // //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Unexpected error during tempGame.move:", e); moveResult = null; }
// // // //     if (moveResult) {
// // // //       console.log(`[makeMove] Success: ${moveResult.san}`);
// // // //       setGame(tempGame); setFen(tempGame.fen());
// // // //       setMoveHistory((prev) => {
// // // //           const nextHistory = [...prev, moveResult.san];
// // // //           const storageKey = getStorageKey(initialFen); // Use correct key
// // // //           try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`Move history saved to local storage (${storageKey}).`); } catch (storageError) { console.error("Failed to save move history to local storage:", storageError); }
// // // //           return nextHistory;
// // // //       });
// // // //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
// // // //       // **** REMOVED: Do NOT update humanPlayerColor here ****
// // // //     } else { console.log("[makeMove] Failed (Illegal Move or Error):", move); success = false; }
// // // //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// // // //   }, [game, updateGameStatus, aiEnabled, initialFen]); // Added initialFen dependency for storage key


// // // //   // --- react-chessboard Callbacks (Use fixed humanPlayerColor) ---
// // // //   const isDraggablePiece = useCallback(({ piece }) => {
// // // //     if (!game || game.isGameOver() || isGameLoading) return false;
// // // //     const pieceColor = piece[0]; // 'w' or 'b'
// // // //     const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';

// // // //     if (aiEnabled) {
// // // //         // AI Mode: Only draggable if it's the human's turn AND the piece belongs to the human
// // // //         const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// // // //         const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
// // // //         return isHumanTurn && isHumanPiece;
// // // //     } else {
// // // //         // Pass & Play Mode: Draggable if it's that piece color's turn. Orientation is fixed.
// // // //         return game.turn() === pieceColor;
// // // //     }
// // // //   }, [game, aiEnabled, isGameLoading, humanPlayerColor]); // Depends on fixed humanPlayerColor

// // // //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// // // //     // ... (no changes needed)
// // // //     if (!game || isGameLoading) return false;
// // // //     if (!piece || piece[1].toLowerCase() !== 'p') return false;
// // // //     return checkIsPromotion(sourceSquare, targetSquare);
// // // //   }, [checkIsPromotion, game, isGameLoading]);

// // // //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// // // //     // ... (no changes needed)
// // // //     if (!game || isGameLoading) return false;
// // // //     if (!piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// // // //     const promotionPiece = piece[1].toLowerCase(); const fromSq = promoteFromSquare ?? pendingManualPromotion?.from; const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// // // //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// // // //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece }); if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// // // //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

// // // //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// // // //     if (!game || isGameLoading) return false;

// // // //     const pieceColor = pieceString[0];
// // // //     const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);

// // // //     // Check if the move is allowed based on game state and mode
// // // //     if (game.isGameOver()) return false;
// // // //     if (aiEnabled && !isHumanTurn) return false; // AI's turn
// // // //     if (!aiEnabled && game.turn() !== pieceColor) return false; // P&P wrong turn

// // // //     // If checks pass, attempt the move
// // // //     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
// // // //     if (isPromo) {
// // // //       return true; // Let promotion dialog handle it
// // // //     } else {
// // // //       const success = makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
// // // //       return success;
// // // //     }
// // // //   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]); // Depends on fixed humanPlayerColor

// // // //   const onSquareClick = useCallback((square) => {
// // // //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;

// // // //     // Prevent clicks if it's AI's turn in AI mode
// // // //     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return;

// // // //     // --- Rest of the logic remains the same ---
// // // //     if (!selectedSquare) {
// // // //         const piece = game.get(square);
// // // //         if (piece && piece.color === game.turn()) { // Check current turn
// // // //             const moves = game.moves({ square: square, verbose: true });
// // // //             if (moves.length > 0) {
// // // //                 setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to));
// // // //             } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // //         } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // //     } else {
// // // //         if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; }
// // // //         if (highlightedSquares.includes(square)) {
// // // //             const isPromo = checkIsPromotion(selectedSquare, square);
// // // //             if (isPromo) {
// // // //                 setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true);
// // // //                 setSelectedSquare(null); setHighlightedSquares([]); return;
// // // //             } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); }
// // // //         } else {
// // // //             const piece = game.get(square);
// // // //             if (piece && piece.color === game.turn()) { // Check current turn
// // // //                 const moves = game.moves({ square: square, verbose: true });
// // // //                 if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
// // // //                 else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // //             } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // // //         }
// // // //     }
// // // //   }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]); // Depends on fixed humanPlayerColor


// // // //   // --- Control Button Functions (No longer change humanPlayerColor) ---
// // // //   const resetGame = useCallback(() => {
// // // //     console.log("Resetting game.");
// // // //     const newGame = initialFen ? new Chess(initialFen) : new Chess();
// // // //     const newFen = newGame.fen();
// // // //     console.log(`Resetting to FEN: ${newFen}`);

// // // //     // **** Determine player color based on reset state BUT DO NOT SET IT ****
// // // //     // The player color is fixed by the initial load via `initialFen`.
// // // //     const initialTurn = newGame.turn();
// // // //     const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
// // // //     console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed from start).`);
// // // //     // setHumanPlayerColor(expectedPlayerColor); // <-- REMOVED

// // // //     setGame(newGame);
// // // //     setFen(newFen);
// // // //     setMoveHistory([]);
// // // //     setForwardMoves([]);
// // // //     setPauseAi(false);
// // // //     setIsAiThinking(false);
// // // //     setSelectedSquare(null);
// // // //     setHighlightedSquares([]);
// // // //     setPromotionDialogOpen(false);
// // // //     setPendingManualPromotion(null);
// // // //     updateGameStatus(newGame);

// // // //     const storageKey = getStorageKey(initialFen);
// // // //     try {
// // // //         localStorage.removeItem(storageKey);
// // // //         console.log(`Cleared local storage on reset (${storageKey}).`);
// // // //     } catch (e) { console.error("Failed to clear local storage on reset:", e); }

// // // //   }, [updateGameStatus, initialFen]); // Depends on initialFen

// // // //   const undoMove = useCallback(() => {
// // // //     if (!game || isGameLoading || isAiThinking) return;
// // // //     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
// // // //     if (moveHistory.length < movesToUndo || game.isGameOver()) return;

// // // //     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
// // // //     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
// // // //     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
// // // //     setForwardMoves((prev) => [...undoneMoves, ...prev]);

// // // //     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
// // // //     console.log(`[Undo] Rebuilding game state from base FEN: ${baseGame.fen()}`);
// // // //     try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }

// // // //     // **** Do NOT set humanPlayerColor here ****
// // // //     const currentTurn = baseGame.turn();
// // // //     // const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // //     // setHumanPlayerColor(newHumanColor); // <-- REMOVED
// // // //     console.log(`[Undo] State restored. Current Turn: ${currentTurn}. Human controls: ${humanPlayerColor} (fixed).`);


// // // //     setGame(baseGame);
// // // //     setFen(baseGame.fen());
// // // //     setMoveHistory(newHistory);

// // // //     const storageKey = getStorageKey(initialFen);
// // // //     try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`Updated history saved to local storage after undo (${storageKey}).`); } catch (storageError) { console.error("Failed to save history to local storage after undo:", storageError); }

// // // //     if (aiEnabled) setPauseAi(true);
// // // //     setIsAiThinking(false);
// // // //     updateGameStatus(baseGame);
// // // //     setSelectedSquare(null); setHighlightedSquares([]);
// // // //     setPromotionDialogOpen(false); setPendingManualPromotion(null);

// // // //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor]); // Added humanPlayerColor (used in log)

// // // //   const forwardMove = useCallback(() => {
// // // //     if (!game || isGameLoading || isAiThinking) return;
// // // //     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
// // // //     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;

// // // //     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
// // // //     const redoSANs = forwardMoves.slice(0, movesToRedo);
// // // //     const remainingForwardMoves = forwardMoves.slice(movesToRedo);
// // // //     const tempGame = new Chess(game.fen());
// // // //     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", redoSANs, e); setForwardMoves([]); return; }

// // // //     const nextHistory = [...moveHistory, ...redoSANs];
// // // //     // **** Do NOT set humanPlayerColor here ****
// // // //     const currentTurn = tempGame.turn();
// // // //     // const newHumanColor = currentTurn === 'w' ? 'white' : 'black';
// // // //     // setHumanPlayerColor(newHumanColor); // <-- REMOVED
// // // //     console.log(`[Redo] State advanced. Current Turn: ${currentTurn}. Human controls: ${humanPlayerColor} (fixed).`);

// // // //     setGame(tempGame);
// // // //     setFen(tempGame.fen());
// // // //     setMoveHistory(nextHistory);

// // // //     const storageKey = getStorageKey(initialFen);
// // // //     try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`Updated history saved to local storage after redo (${storageKey}).`); } catch (storageError) { console.error("Failed to save history to local storage after redo:", storageError); }

// // // //     setForwardMoves(remainingForwardMoves);
// // // //     updateGameStatus(tempGame);
// // // //     if (aiEnabled) setPauseAi(false);
// // // //     setIsAiThinking(false);
// // // //     setSelectedSquare(null); setHighlightedSquares([]);
// // // //     setPromotionDialogOpen(false); setPendingManualPromotion(null);
// // // //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor]); // Added humanPlayerColor (used in log)


// // // //   // --- AI Logic (Uses fixed humanPlayerColor) ---
// // // //   const fetchBestMove = useCallback(async (currentFen) => {
// // // //     // ... (no changes needed)
// // // //     const depth = 4;
// // // //     const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
// // // //     console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
// // // //     try {
// // // //         const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`);
// // // //         const data = await res.json();
// // // //         if (data.success && data.bestmove && typeof data.bestmove === 'string') {
// // // //             const bestMoveString = data.bestmove.split(" ")[1];
// // // //             if (bestMoveString && bestMoveString.length >= 4) {
// // // //               const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4);
// // // //               const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
// // // //               console.log("[fetchBestMove] AI Move received:", { from, to, promotion }); return { from, to, promotion };
// // // //             } else { console.error("[fetchBestMove] Invalid bestmove format:", data.bestmove); return null; }
// // // //         } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; }
// // // //     } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
// // // //   }, []); // No dependencies needed

// // // //   useEffect(() => {
// // // //     if (!game || game.isGameOver() || isGameLoading) return;
// // // //     // Determine AI's turn based on fixed humanPlayerColor
// // // //     const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
// // // //     let timeoutId = null;
// // // //     if (aiEnabled && !pauseAi && isAITurn) {
// // // //       const currentFen = game.fen();
// // // //       console.log(`[AI Effect] AI turn (${game.turn()}) detected. Scheduling fetch...`);
// // // //       setIsAiThinking(true);
// // // //       timeoutId = setTimeout(async () => {
// // // //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// // // //         if (stillValidToFetch) {
// // // //           console.log("[AI Effect] Executing fetch for FEN:", currentFen);
// // // //           const bestMove = await fetchBestMove(currentFen);
// // // //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// // // //           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); }
// // // //           else { console.log("[AI Effect] AI move aborted (State changed or fetch failed)."); }
// // // //         } else { console.log("[AI Effect] AI move fetch aborted (State changed before timeout)."); }
// // // //         setIsAiThinking(false);
// // // //       }, 1000);
// // // //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking indicator."); setIsAiThinking(false); }
// // // //     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI move timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) { setIsAiThinking(false); } } };
// // // //   }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]); // Depends on fixed humanPlayerColor


// // // //   // --- Auto-scroll Move History (Unchanged) ---
// // // //   useEffect(() => {
// // // //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// // // //   }, [moveHistory]);


// // // //   // --- Helper to generate custom square styles (Unchanged) ---
// // // //   const getCustomSquareStyles = useCallback(() => {
// // // //     // ... (no changes needed)
// // // //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// // // //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// // // //     if (selectedSquare) { styles[selectedSquare] = { ...(styles[selectedSquare] ?? {}), backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// // // //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// // // //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// // // //   // --- Render (Uses fixed boardOrientation, MODIFIED History Display) ---
// // // //   return (
// // // //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// // // //       {/* --- Chessboard Area (Uses fixed orientation) --- */}
// // // //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// // // //         {/* Header */}
// // // //         <Flex justify="space-between" align="center" mb={3} px={1}>
// // // //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// // // //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// // // //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// // // //               {isGameLoading ? "Loading Game..." : statusText}
// // // //             </Text>
// // // //           </Flex>
// // // //           <HStack spacing={3} align="center" flexShrink={0}>
// // // //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// // // //               {/* Display AI color based on the fixed human player color */}
// // // //               {aiEnabled
// // // //                 ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})`
// // // //                 : "Pass & Play"}
// // // //             </Text>
// // // //             <Switch
// // // //               id="ai-switch" colorScheme="teal" isChecked={aiEnabled}
// // // //               onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }}
// // // //               isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"
// // // //             />
// // // //           </HStack>
// // // //         </Flex>

// // // //         {/* The Chessboard Component */}
// // // //         {isGameLoading ? (
// // // //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// // // //                 <Text color={statusTextColor}>Loading Board...</Text>
// // // //             </Box>
// // // //         ) : (
// // // //             <Chessboard
// // // //               id="PlayerVsAiBoard"
// // // //               position={fen}
// // // //               isDraggablePiece={isDraggablePiece}
// // // //               onPieceDrop={onPieceDrop}
// // // //               onSquareClick={onSquareClick}
// // // //               onPromotionCheck={onPromotionCheck}
// // // //               onPromotionPieceSelect={handlePromotionPieceSelect}
// // // //               showPromotionDialog={promotionDialogOpen}
// // // //               promotionToSquare={pendingManualPromotion?.to ?? null}
// // // //               promotionDialogVariant="modal"
// // // //               // **** Orientation is now fixed based on initial load ****
// // // //               boardOrientation={humanPlayerColor}
// // // //               boardWidth={420}
// // // //               customSquareStyles={getCustomSquareStyles()}
// // // //               customDarkSquareStyle={customDarkSquareStyle}
// // // //               customLightSquareStyle={customLightSquareStyle}
// // // //               snapToCursor={true}
// // // //               animationDuration={150}
// // // //             />
// // // //         )}
// // // //       </Box>

// // // //       {/* --- Sidebar Area (MODIFIED History Display Logic) --- */}
// // // //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// // // //         {/* Controls Section */}
// // // //         <VStack align="stretch" spacing={3}>
// // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// // // //              <HStack spacing={3}>
// // // //                {/* Disable logic unchanged, relies on moveHistory length */}
// // // //                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
// // // //                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
// // // //              </HStack>
// // // //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// // // //         </VStack>
// // // //         <Divider />

// // // //         {/* Move History Section (MODIFIED DISPLAY LOGIC) */}
// // // //          <VStack align="stretch" spacing={2}>
// // // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// // // //             <Box
// // // //               ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// // // //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// // // //             >
// // // //               {isGameLoading ? (
// // // //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// // // //               ) : moveHistory.length === 0 ? (
// // // //                 <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// // // //                ) : (
// // // //                  <VStack spacing={1} align="stretch">
// // // //                     {/* Iterate through move *pairs* */}
// // // //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
// // // //                         const moveNumber = i + 1;
// // // //                         // Get potential moves from the *actual* history array
// // // //                         const whiteMoveIndex = i * 2;
// // // //                         const blackMoveIndex = i * 2 + 1;
// // // //                         const whiteMoveSAN = moveHistory[whiteMoveIndex];
// // // //                         const blackMoveSAN = moveHistory[blackMoveIndex];

// // // //                         // Determine if these were the *absolute* last moves made
// // // //                         const isLastWhite = whiteMoveIndex === moveHistory.length - 1;
// // // //                         const isLastBlack = blackMoveIndex === moveHistory.length - 1;

// // // //                         // **** CONDITIONAL DISPLAY LOGIC ****
// // // //                         let firstMoveSAN, secondMoveSAN;
// // // //                         let isFirstMoveLast, isSecondMoveLast;
// // // //                         let firstMoveTitle, secondMoveTitle;
// // // //                         let isFirstPlaceholder = false;

// // // //                         if (humanPlayerColor === 'white') {
// // // //                             // Standard display: White then Black
// // // //                             firstMoveSAN = whiteMoveSAN;
// // // //                             secondMoveSAN = blackMoveSAN;
// // // //                             isFirstMoveLast = isLastWhite;
// // // //                             isSecondMoveLast = isLastBlack;
// // // //                             firstMoveTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}` : '';
// // // //                             secondMoveTitle = blackMoveSAN ? `Black move ${moveNumber}: ${blackMoveSAN}` : '';
// // // //                         } else {
// // // //                             // Reversed display: Black then White (with placeholder for first black move if needed)
// // // //                             if (moveNumber === 1 && !blackMoveSAN && whiteMoveSAN) {
// // // //                                 // Special case: Only white has moved, black (human) hasn't yet.
// // // //                                 firstMoveSAN = "...";
// // // //                                 isFirstPlaceholder = true;
// // // //                                 secondMoveSAN = whiteMoveSAN; // Show white's move in second slot
// // // //                                 isFirstMoveLast = false; // Placeholder isn't the last move
// // // //                                 isSecondMoveLast = isLastWhite; // White's move is the last
// // // //                                 firstMoveTitle = `Black move ${moveNumber}: (pending)`;
// // // //                                 secondMoveTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}`: '';

// // // //                             } else {
// // // //                                 firstMoveSAN = blackMoveSAN; // Show black move first normally
// // // //                                 secondMoveSAN = whiteMoveSAN;
// // // //                                 isFirstMoveLast = isLastBlack;
// // // //                                 isSecondMoveLast = isLastWhite;
// // // //                                 firstMoveTitle = blackMoveSAN ? `Black move ${moveNumber}: ${blackMoveSAN}` : '';
// // // //                                 secondMoveTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}`: '';
// // // //                             }
// // // //                         }

// // // //                         return (
// // // //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// // // //                              {/* Move Number */}
// // // //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>

// // // //                              {/* First Move Slot (Conditional Content) */}
// // // //                              <Text
// // // //                                 minW="55px" px={1}
// // // //                                 fontWeight={isFirstMoveLast ? 'extrabold': 'normal'}
// // // //                                 color={isFirstMoveLast ? lastMoveColor : (isFirstPlaceholder ? placeholderMoveColor : defaultMoveColor)}
// // // //                                 title={firstMoveTitle}
// // // //                                 visibility={firstMoveSAN ? 'visible' : 'hidden'} // Hide if null/undefined (unless placeholder)
// // // //                              >
// // // //                                {firstMoveSAN ?? ""}
// // // //                              </Text>

// // // //                              {/* Second Move Slot (Conditional Content) */}
// // // //                              <Text
// // // //                                 minW="55px" px={1}
// // // //                                 fontWeight={isSecondMoveLast ? 'extrabold': 'normal'}
// // // //                                 color={isSecondMoveLast ? lastMoveColor : defaultMoveColor}
// // // //                                 visibility={secondMoveSAN ? 'visible' : 'hidden'} // Hide if null/undefined
// // // //                                 title={secondMoveTitle}
// // // //                              >
// // // //                                {secondMoveSAN ?? ""}
// // // //                              </Text>
// // // //                           </Flex>
// // // //                         )
// // // //                     })}
// // // //                  </VStack>
// // // //               )}
// // // //             </Box>
// // // //          </VStack>
// // // //       </VStack>
// // // //     </HStack>
// // // //   );
// // // // };

// // // // export default ChessGame;

// // // import React, { useState, useEffect, useCallback, useRef } from "react";
// // // import { Chess } from "chess.js";
// // // import { Chessboard } from "react-chessboard";
// // // import {
// // //   Box,
// // //   Text,
// // //   VStack,
// // //   Button,
// // //   HStack,
// // //   Divider,
// // //   useColorModeValue,
// // //   Flex,
// // //   Switch,
// // //   Spinner,
// // // } from "@chakra-ui/react";

// // // // --- Local Storage Key ---
// // // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';
// // // // Helper function to get the appropriate storage key based on FEN
// // // const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;


// // // // --- Helper Functions (Logical - Unchanged) ---
// // // const findKingSquareFn = (gameInstance) => {
// // //     if (!gameInstance) return null;
// // //     const board = gameInstance.board();
// // //     for (let r = 0; r < 8; r++) {
// // //       for (let c = 0; c < 8; c++) {
// // //         const piece = board[r][c];
// // //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// // //           return "abcdefgh"[c] + (8 - r);
// // //         }
// // //       }
// // //     }
// // //     return null;
// // // };
// // // const checkIsPromotionFn = (gameInstance, from, to) => {
// // //     if (!from || !to || !gameInstance) return false;
// // //     const piece = gameInstance.get(from);
// // //     if (!piece || piece.type !== 'p') return false;
// // //     const targetRank = to[1];
// // //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// // //     if (targetRank !== promotionRank) return false;
// // //     const moves = gameInstance.moves({ square: from, verbose: true });
// // //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // // };


// // // // --- Main Component ---
// // // const ChessGame = ({ initialFen }) => {
// // //   // --- State ---
// // //   const [game, setGame] = useState(null);
// // //   const [fen, setFen] = useState(initialFen || "start");
// // //   const [moveHistory, setMoveHistory] = useState([]); // Stores moves sequentially: [w1, b1, w2, b2, ...]
// // //   const [forwardMoves, setForwardMoves] = useState([]);
// // //   const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Determined once on load
// // //   const [aiEnabled, setAiEnabled] = useState(true);
// // //   const [pauseAi, setPauseAi] = useState(false);
// // //   const [isAiThinking, setIsAiThinking] = useState(false);
// // //   const [selectedSquare, setSelectedSquare] = useState(null);
// // //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// // //   const [statusText, setStatusText] = useState("Loading Game...");
// // //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// // //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// // //   const [isGameLoading, setIsGameLoading] = useState(true);

// // //   // --- Refs (Unchanged) ---
// // //   const moveHistoryRef = useRef(null);

// // //   // --- UI Styling Values (Unchanged) ---
// // //   const pageBg = useColorModeValue("gray.100", "gray.800");
// // //   const boardContainerBg = useColorModeValue("white", "gray.700");
// // //   const historyBg = useColorModeValue("white", "gray.700");
// // //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// // //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// // //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// // //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// // //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// // //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// // //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// // //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// // //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// // //   const lastMoveColor = useColorModeValue('black','white');
// // //   const defaultMoveColor = useColorModeValue("gray.700", "gray.300");
// // //   const placeholderMoveColor = useColorModeValue("gray.400", "gray.500"); // Color for "..."
// // //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// // //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// // //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// // //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// // //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// // //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// // //   // --- Utility Functions (Unchanged) ---
// // //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// // //   const updateGameStatus = useCallback((currentGame) => {
// // //     if (!currentGame) { setStatusText("Game not loaded"); return; }
// // //     let status = "";
// // //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// // //     else if (currentGame.isStalemate()) status = "Stalemate!";
// // //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// // //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// // //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// // //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// // //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// // //     setStatusText(status);
// // //   }, []);

// // //   // --- Load Game on Mount (Sets fixed player color) ---
// // //   useEffect(() => {
// // //     console.log("Attempting to initialize game state...");
// // //     let loadedGame = null;
// // //     let loadedHistory = [];
// // //     let loadSource = "";
// // //     const storageKey = getStorageKey(initialFen);

// // //     // Logic to load game from initialFen or localStorage (UNCHANGED)
// // //     if (initialFen) {
// // //       loadSource = "initialFen prop";
// // //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// // //       try {
// // //         loadedGame = new Chess(initialFen);
// // //         if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
// // //         loadedHistory = [];
// // //         console.log("Successfully initialized game from initialFen.");
// // //         try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
// // //       } catch (fenError) {
// // //         console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
// // //         loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
// // //       }
// // //     } else {
// // //       loadSource = "localStorage attempt";
// // //       console.log("No initialFen. Attempting load from storage...");
// // //       try {
// // //         const storedHistoryString = localStorage.getItem(storageKey);
// // //         if (storedHistoryString) {
// // //           const parsedHistory = JSON.parse(storedHistoryString);
// // //           if (Array.isArray(parsedHistory)) {
// // //             loadedGame = new Chess(); // Start fresh
// // //             try {
// // //               parsedHistory.forEach(san => loadedGame.move(san));
// // //               console.log("Successfully replayed history from storage.");
// // //               loadedHistory = parsedHistory; loadSource = "localStorage success";
// // //             } catch (replayError) {
// // //               console.error("Error replaying stored history:", replayError);
// // //               localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage replay error";
// // //             }
// // //           } else { /* Handle non-array stored data */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage format error"; }
// // //         } else { /* No stored history */ loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage empty"; }
// // //       } catch (parseError) { /* Handle JSON parse error */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage parse error"; }
// // //     }

// // //     // Set game state
// // //     setGame(loadedGame);
// // //     setFen(loadedGame.fen());
// // //     setMoveHistory(loadedHistory); // History is always [w1, b1, w2, b2...]
// // //     updateGameStatus(loadedGame);

// // //     // **** Set human player color ONCE based on loaded game's turn ****
// // //     const initialTurn = loadedGame.turn();
// // //     const playerColor = initialTurn === 'w' ? 'white' : 'black';
// // //     setHumanPlayerColor(playerColor); // Fixed after this point
// // //     console.log(`Game loaded. Initial Turn: ${initialTurn}. Human Player controls: ${playerColor}.`);

// // //     setIsGameLoading(false);
// // //     console.log(`Game loading complete. Source: ${loadSource}`);
// // //   }, [initialFen, updateGameStatus]);


// // //   // --- Core Game Logic (Saves history normally) ---
// // //   const makeMove = useCallback((move) => {
// // //     if (!game) return false;
// // //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// // //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Error making move:", e); moveResult = null; }
// // //     if (moveResult) {
// // //       console.log(`[makeMove] Success: ${moveResult.san}`);
// // //       setGame(tempGame); setFen(tempGame.fen());
// // //       setMoveHistory((prev) => {
// // //           const nextHistory = [...prev, moveResult.san]; // Append normally
// // //           const storageKey = getStorageKey(initialFen);
// // //           try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved (${storageKey})`); } catch (e) { console.error("Failed to save history:", e); }
// // //           return nextHistory; // Return standard sequence
// // //       });
// // //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
// // //     } else { console.log("[makeMove] Failed (Illegal Move/Error):", move); success = false; }
// // //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// // //   }, [game, updateGameStatus, aiEnabled, initialFen]);


// // //   // --- react-chessboard Callbacks (Use fixed humanPlayerColor) ---
// // //   const isDraggablePiece = useCallback(({ piece }) => {
// // //     if (!game || game.isGameOver() || isGameLoading) return false;
// // //     const pieceColor = piece[0];
// // //     const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';
// // //     if (aiEnabled) {
// // //         const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// // //         const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
// // //         return isHumanTurn && isHumanPiece;
// // //     } else { return game.turn() === pieceColor; } // P&P: only current turn's pieces
// // //   }, [game, aiEnabled, isGameLoading, humanPlayerColor]);

// // //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// // //     if (!game || isGameLoading || !piece || piece[1].toLowerCase() !== 'p') return false;
// // //     return checkIsPromotion(sourceSquare, targetSquare);
// // //   }, [checkIsPromotion, game, isGameLoading]);

// // //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// // //     if (!game || isGameLoading || !piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// // //     const promotionPiece = piece[1].toLowerCase();
// // //     const fromSq = promoteFromSquare ?? pendingManualPromotion?.from;
// // //     const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// // //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// // //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece });
// // //     if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// // //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

// // //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// // //     if (!game || isGameLoading || game.isGameOver()) return false;
// // //     const pieceColor = pieceString[0];
// // //     const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// // //     if (aiEnabled && !isHumanTurn) return false; // AI's turn
// // //     if (!aiEnabled && game.turn() !== pieceColor) return false; // P&P wrong turn
// // //     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
// // //     if (isPromo) return true; // Let promotion dialog handle
// // //     else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
// // //   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

// // //   const onSquareClick = useCallback((square) => {
// // //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;
// // //     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return; // AI's turn

// // //     if (!selectedSquare) {
// // //         const piece = game.get(square);
// // //         if (piece && piece.color === game.turn()) {
// // //             const moves = game.moves({ square: square, verbose: true });
// // //             if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
// // //             else { setSelectedSquare(null); setHighlightedSquares([]); }
// // //         } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // //     } else {
// // //         if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; }
// // //         if (highlightedSquares.includes(square)) {
// // //             const isPromo = checkIsPromotion(selectedSquare, square);
// // //             if (isPromo) {
// // //                 setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true);
// // //                 setSelectedSquare(null); setHighlightedSquares([]);
// // //             } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); }
// // //         } else {
// // //             const piece = game.get(square);
// // //             if (piece && piece.color === game.turn()) {
// // //                 const moves = game.moves({ square: square, verbose: true });
// // //                 if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
// // //                 else { setSelectedSquare(null); setHighlightedSquares([]); }
// // //             } else { setSelectedSquare(null); setHighlightedSquares([]); }
// // //         }
// // //     }
// // //   }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


// // //   // --- Control Button Functions (Use fixed humanPlayerColor, no changes to it) ---
// // //   const resetGame = useCallback(() => {
// // //     console.log("Resetting game.");
// // //     const newGame = initialFen ? new Chess(initialFen) : new Chess();
// // //     const initialTurn = newGame.turn();
// // //     const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
// // //     console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed).`);
// // //     setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
// // //     setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
// // //     setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
// // //     const storageKey = getStorageKey(initialFen);
// // //     try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
// // //   }, [updateGameStatus, initialFen]);

// // //   const undoMove = useCallback(() => {
// // //     if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
// // //     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
// // //     if (moveHistory.length < movesToUndo || game.isGameOver()) return;
// // //     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
// // //     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
// // //     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
// // //     setForwardMoves((prev) => [...undoneMoves, ...prev]);
// // //     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
// // //     try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
// // //     console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
// // //     setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
// // //     const storageKey = getStorageKey(initialFen);
// // //     try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
// // //     if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
// // //     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// // //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);

// // //   const forwardMove = useCallback(() => {
// // //     if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
// // //     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
// // //     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
// // //     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
// // //     const redoSANs = forwardMoves.slice(0, movesToRedo);
// // //     const remainingForwardMoves = forwardMoves.slice(movesToRedo);
// // //     const tempGame = new Chess(game.fen());
// // //     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", e); setForwardMoves([]); return; }
// // //     const nextHistory = [...moveHistory, ...redoSANs];
// // //     console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
// // //     setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
// // //     const storageKey = getStorageKey(initialFen);
// // //     try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
// // //     setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
// // //     if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
// // //     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// // //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);


// // //   // --- AI Logic (Uses fixed humanPlayerColor) ---
// // //   const fetchBestMove = useCallback(async (currentFen) => {
// // //     const depth = 4;
// // //     const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
// // //     console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
// // //     try {
// // //         const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`);
// // //         const data = await res.json();
// // //         if (data.success && data.bestmove && typeof data.bestmove === 'string') {
// // //             const bestMoveString = data.bestmove.split(" ")[1];
// // //             if (bestMoveString && bestMoveString.length >= 4) {
// // //               const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4);
// // //               const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
// // //               return { from, to, promotion };
// // //             } else { console.error("[fetchBestMove] Invalid bestmove format:", data.bestmove); return null; }
// // //         } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; }
// // //     } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!game || game.isGameOver() || isGameLoading) return;
// // //     const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
// // //     let timeoutId = null;
// // //     if (aiEnabled && !pauseAi && isAITurn) {
// // //       const currentFen = game.fen(); console.log(`[AI Effect] AI turn (${game.turn()}). Scheduling fetch...`);
// // //       setIsAiThinking(true);
// // //       timeoutId = setTimeout(async () => {
// // //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// // //         if (stillValidToFetch) {
// // //           console.log("[AI Effect] Fetching for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
// // //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// // //           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); }
// // //           else { console.log("[AI Effect] AI move aborted."); }
// // //         } else { console.log("[AI Effect] AI fetch aborted."); }
// // //         setIsAiThinking(false);
// // //       }, 1000);
// // //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking."); setIsAiThinking(false); }
// // //     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) setIsAiThinking(false); } };
// // //   }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


// // //   // --- Auto-scroll Move History (Unchanged) ---
// // //   useEffect(() => {
// // //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// // //   }, [moveHistory]);


// // //   // --- Helper to generate custom square styles (Unchanged) ---
// // //   const getCustomSquareStyles = useCallback(() => {
// // //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// // //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// // //     if (selectedSquare) { styles[selectedSquare] = { backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// // //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// // //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// // //   // --- Render (Uses fixed boardOrientation, MODIFIED History Display) ---
// // //   return (
// // //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// // //       {/* --- Chessboard Area (Uses fixed orientation) --- */}
// // //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// // //         {/* Header */}
// // //         <Flex justify="space-between" align="center" mb={3} px={1}>
// // //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// // //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// // //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// // //               {isGameLoading ? "Loading Game..." : statusText}
// // //             </Text>
// // //           </Flex>
// // //           <HStack spacing={3} align="center" flexShrink={0}>
// // //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// // //               {aiEnabled ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})` : "Pass & Play"}
// // //             </Text>
// // //             <Switch id="ai-switch" colorScheme="teal" isChecked={aiEnabled} onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }} isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"/>
// // //           </HStack>
// // //         </Flex>

// // //         {/* The Chessboard Component */}
// // //         {isGameLoading ? (
// // //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// // //                 <Text color={statusTextColor}>Loading Board...</Text>
// // //             </Box>
// // //         ) : (
// // //             <Chessboard id="PlayerVsAiBoard" position={fen} isDraggablePiece={isDraggablePiece} onPieceDrop={onPieceDrop} onSquareClick={onSquareClick} onPromotionCheck={onPromotionCheck} onPromotionPieceSelect={handlePromotionPieceSelect} showPromotionDialog={promotionDialogOpen} promotionToSquare={pendingManualPromotion?.to ?? null} promotionDialogVariant="modal"
// // //               boardOrientation={humanPlayerColor} boardWidth={420} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
// // //         )}
// // //       </Box>

// // //       {/* --- Sidebar Area (MODIFIED History Display Logic) --- */}
// // //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// // //         {/* Controls Section */}
// // //         <VStack align="stretch" spacing={3}>
// // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// // //              <HStack spacing={3}>
// // //                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
// // //                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
// // //              </HStack>
// // //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// // //         </VStack>
// // //         <Divider />

// // //         {/* Move History Section (MODIFIED DISPLAY LOGIC) */}
// // //          <VStack align="stretch" spacing={2}>
// // //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// // //             <Box ref={moveHistoryRef} h="350px" w="100%" overflowY="auto" bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// // //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// // //             >
// // //               {isGameLoading ? (
// // //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// // //               ) : moveHistory.length === 0 ? (
// // //                 <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// // //                ) : (
// // //                  <VStack spacing={1} align="stretch">
// // //                     {/* Iterate through move *pairs* */}
// // //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
// // //                         const moveNumber = i + 1;
// // //                         // Get moves from the *actual* history array (always W, B, W, B...)
// // //                         const whiteMoveIndex = i * 2;
// // //                         const blackMoveIndex = i * 2 + 1;
// // //                         const whiteMoveSAN = moveHistory[whiteMoveIndex]; // Might be undefined
// // //                         const blackMoveSAN = moveHistory[blackMoveIndex]; // Might be undefined

// // //                         // Determine if these were the *absolute* last moves made
// // //                         const isLastWhite = whiteMoveIndex === moveHistory.length - 1;
// // //                         const isLastBlack = blackMoveIndex === moveHistory.length - 1;

// // //                         // **** CONDITIONAL DISPLAY LOGIC ****
// // //                         let displayWhiteMove, displayBlackMove;
// // //                         let isWhiteSlotLast, isBlackSlotLast;
// // //                         let whiteSlotTitle, blackSlotTitle;
// // //                         let usePlaceholder = false;

// // //                         // Check if human is black AND it's the first move row
// // //                         if (humanPlayerColor === 'black' && moveNumber === 1) {
// // //                             usePlaceholder = true;
// // //                             displayWhiteMove = "..."; // Placeholder for White's move
// // //                             displayBlackMove = blackMoveSAN; // Show Black's move if available
// // //                             isWhiteSlotLast = false; // Placeholder is never "last"
// // //                             isBlackSlotLast = isLastBlack; // Black's move could be last
// // //                             whiteSlotTitle = "White move 1: (skipped)";
// // //                             blackSlotTitle = blackMoveSAN ? `Black move 1: ${blackMoveSAN}` : '';
// // //                         } else {
// // //                             // Default display for White player OR rows after the first for Black player
// // //                             displayWhiteMove = whiteMoveSAN;
// // //                             displayBlackMove = blackMoveSAN;
// // //                             isWhiteSlotLast = isLastWhite;
// // //                             isBlackSlotLast = isLastBlack;
// // //                             whiteSlotTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}` : '';
// // //                             blackSlotTitle = blackMoveSAN ? `Black move ${moveNumber}: ${blackMoveSAN}` : '';
// // //                         }

// // //                         return (
// // //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// // //                              {/* Move Number */}
// // //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>

// // //                              {/* White Move Slot (or Placeholder) */}
// // //                              <Text
// // //                                 minW="55px" px={1}
// // //                                 fontWeight={isWhiteSlotLast ? 'extrabold': 'normal'}
// // //                                 color={isWhiteSlotLast ? lastMoveColor : (usePlaceholder ? placeholderMoveColor : defaultMoveColor)}
// // //                                 title={whiteSlotTitle}
// // //                                 visibility={displayWhiteMove ? 'visible' : 'hidden'} // Handles null/undefined unless placeholder
// // //                              >
// // //                                {displayWhiteMove ?? ""}
// // //                              </Text>

// // //                              {/* Black Move Slot */}
// // //                              <Text
// // //                                 minW="55px" px={1}
// // //                                 fontWeight={isBlackSlotLast ? 'extrabold': 'normal'}
// // //                                 color={isBlackSlotLast ? lastMoveColor : defaultMoveColor}
// // //                                 visibility={displayBlackMove ? 'visible' : 'hidden'} // Handles null/undefined
// // //                                 title={blackSlotTitle}
// // //                              >
// // //                                {displayBlackMove ?? ""}
// // //                              </Text>
// // //                           </Flex>
// // //                         )
// // //                     })}
// // //                  </VStack>
// // //               )}
// // //             </Box>
// // //          </VStack>
// // //       </VStack>
// // //     </HStack>
// // //   );
// // // };

// // // export default ChessGame;

// // import React, { useState, useEffect, useCallback, useRef } from "react";
// // import { Chess } from "chess.js";
// // import { Chessboard } from "react-chessboard";
// // import {
// //   Box,
// //   Text,
// //   VStack,
// //   Button,
// //   HStack,
// //   Divider,
// //   useColorModeValue,
// //   Flex,
// //   Switch,
// //   Spinner,
// // } from "@chakra-ui/react";

// // // --- Local Storage Key ---
// // const LOCAL_STORAGE_KEY = 'chessGameMoveHistory';
// // // Helper function to get the appropriate storage key based on FEN
// // const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;


// // // --- Helper Functions (Logical - Unchanged) ---
// // const findKingSquareFn = (gameInstance) => {
// //     if (!gameInstance) return null;
// //     const board = gameInstance.board();
// //     for (let r = 0; r < 8; r++) {
// //       for (let c = 0; c < 8; c++) {
// //         const piece = board[r][c];
// //         if (piece && piece.type === "k" && piece.color === gameInstance.turn()) {
// //           return "abcdefgh"[c] + (8 - r);
// //         }
// //       }
// //     }
// //     return null;
// // };
// // const checkIsPromotionFn = (gameInstance, from, to) => {
// //     if (!from || !to || !gameInstance) return false;
// //     const piece = gameInstance.get(from);
// //     if (!piece || piece.type !== 'p') return false;
// //     const targetRank = to[1];
// //     const promotionRank = (piece.color === 'w') ? '8' : '1';
// //     if (targetRank !== promotionRank) return false;
// //     const moves = gameInstance.moves({ square: from, verbose: true });
// //     return moves.some(m => m.to === to && (m.flags.includes('p') || m.promotion));
// // };


// // // --- Main Component ---
// // const ChessGame = ({ initialFen }) => {
// //   // --- State ---
// //   const [game, setGame] = useState(null);
// //   const [fen, setFen] = useState(initialFen || "start");
// //   const [moveHistory, setMoveHistory] = useState([]); // Stores moves sequentially: [w1, b1, w2, b2, ...]
// //   const [forwardMoves, setForwardMoves] = useState([]);
// //   const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Determined once on load
// //   const [aiEnabled, setAiEnabled] = useState(true);
// //   const [pauseAi, setPauseAi] = useState(false);
// //   const [isAiThinking, setIsAiThinking] = useState(false);
// //   const [selectedSquare, setSelectedSquare] = useState(null);
// //   const [highlightedSquares, setHighlightedSquares] = useState([]);
// //   const [statusText, setStatusText] = useState("Loading Game...");
// //   const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
// //   const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
// //   const [isGameLoading, setIsGameLoading] = useState(true);

// //   // --- Refs (Unchanged) ---
// //   const moveHistoryRef = useRef(null);

// //   // --- UI Styling Values (Unchanged except placeholder color if needed) ---
// //   const pageBg = useColorModeValue("gray.100", "gray.800");
// //   const boardContainerBg = useColorModeValue("white", "gray.700");
// //   const historyBg = useColorModeValue("white", "gray.700");
// //   const scrollbarTrackBg = useColorModeValue("gray.100", "gray.600");
// //   const scrollbarThumbBg = useColorModeValue("gray.400", "gray.400");
// //   const scrollbarThumbHoverBg = useColorModeValue("gray.500", "gray.300");
// //   const boardBorderColor = useColorModeValue("gray.300", "gray.600");
// //   const historyBorderColor = useColorModeValue("gray.200", "gray.600");
// //   const statusTextColor = useColorModeValue("gray.800", "gray.50");
// //   const controlsTextColor = useColorModeValue("gray.700", "gray.200");
// //   const historyTextColor = useColorModeValue("gray.500", "gray.400");
// //   const historyMoveNumColor = useColorModeValue("gray.600", "gray.400");
// //   const lastMoveColor = useColorModeValue('black','white');
// //   const defaultMoveColor = useColorModeValue("gray.700", "gray.300");
// //   // Ensure placeholder color contrasts reasonably
// //   const placeholderMoveColor = useColorModeValue("gray.500", "gray.400");
// //   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
// //   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
// //   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
// //   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
// //   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
// //   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

// //   // --- Utility Functions (Unchanged) ---
// //   const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
// //   const updateGameStatus = useCallback((currentGame) => {
// //     if (!currentGame) { setStatusText("Game not loaded"); return; }
// //     let status = "";
// //     if (currentGame.isCheckmate()) status = `${currentGame.turn() === "w" ? "Black" : "White"} wins by Checkmate!`;
// //     else if (currentGame.isStalemate()) status = "Stalemate!";
// //     else if (currentGame.isThreefoldRepetition()) status = "Draw by Threefold Repetition";
// //     else if (currentGame.isInsufficientMaterial()) status = "Draw by Insufficient Material";
// //     else if (currentGame.isDraw()) status = "Draw by 50-move rule";
// //     else if (currentGame.inCheck()) status = `${currentGame.turn() === "w" ? "White" : "Black"} is in Check!`;
// //     else status = `${currentGame.turn() === "w" ? "White's" : "Black's"} Turn`;
// //     setStatusText(status);
// //   }, []);

// //   // --- Load Game on Mount (Sets fixed player color) ---
// //   useEffect(() => {
// //     console.log("Attempting to initialize game state...");
// //     let loadedGame = null;
// //     let loadedHistory = [];
// //     let loadSource = "";
// //     const storageKey = getStorageKey(initialFen);

// //     // Logic to load game from initialFen or localStorage (UNCHANGED)
// //     if (initialFen) {
// //       loadSource = "initialFen prop";
// //       console.log(`Initializing game from provided initialFen: ${initialFen}`);
// //       try {
// //         loadedGame = new Chess(initialFen);
// //         if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
// //         loadedHistory = [];
// //         console.log("Successfully initialized game from initialFen.");
// //         try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
// //       } catch (fenError) {
// //         console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
// //         loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
// //       }
// //     } else {
// //       loadSource = "localStorage attempt";
// //       console.log("No initialFen. Attempting load from storage...");
// //       try {
// //         const storedHistoryString = localStorage.getItem(storageKey);
// //         if (storedHistoryString) {
// //           const parsedHistory = JSON.parse(storedHistoryString);
// //           if (Array.isArray(parsedHistory)) {
// //             loadedGame = new Chess(); // Start fresh
// //             try {
// //               parsedHistory.forEach(san => loadedGame.move(san));
// //               console.log("Successfully replayed history from storage.");
// //               loadedHistory = parsedHistory; loadSource = "localStorage success";
// //             } catch (replayError) {
// //               console.error("Error replaying stored history:", replayError);
// //               localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage replay error";
// //             }
// //           } else { /* Handle non-array stored data */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage format error"; }
// //         } else { /* No stored history */ loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage empty"; }
// //       } catch (parseError) { /* Handle JSON parse error */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage parse error"; }
// //     }

// //     // Set game state
// //     setGame(loadedGame);
// //     setFen(loadedGame.fen());
// //     setMoveHistory(loadedHistory); // History is always [w1, b1, w2, b2...]
// //     updateGameStatus(loadedGame);

// //     // **** Set human player color ONCE based on loaded game's turn ****
// //     const initialTurn = loadedGame.turn();
// //     const playerColor = initialTurn === 'w' ? 'white' : 'black';
// //     setHumanPlayerColor(playerColor); // Fixed after this point
// //     console.log(`Game loaded. Initial Turn: ${initialTurn}. Human Player controls: ${playerColor}.`);

// //     setIsGameLoading(false);
// //     console.log(`Game loading complete. Source: ${loadSource}`);
// //   }, [initialFen, updateGameStatus]);


// //   // --- Core Game Logic (Saves history normally) ---
// //   const makeMove = useCallback((move) => {
// //     if (!game) return false;
// //     let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
// //     try { moveResult = tempGame.move(move); } catch (e) { console.error("Error making move:", e); moveResult = null; }
// //     if (moveResult) {
// //       console.log(`[makeMove] Success: ${moveResult.san}`);
// //       setGame(tempGame); setFen(tempGame.fen());
// //       setMoveHistory((prev) => {
// //           const nextHistory = [...prev, moveResult.san]; // Append normally
// //           const storageKey = getStorageKey(initialFen);
// //           try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved (${storageKey})`); } catch (e) { console.error("Failed to save history:", e); }
// //           return nextHistory; // Return standard sequence
// //       });
// //       setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
// //     } else { console.log("[makeMove] Failed (Illegal Move/Error):", move); success = false; }
// //     setSelectedSquare(null); setHighlightedSquares([]); return success;
// //   }, [game, updateGameStatus, aiEnabled, initialFen]);


// //   // --- react-chessboard Callbacks (Use fixed humanPlayerColor) ---
// //   // (isDraggablePiece, onPromotionCheck, handlePromotionPieceSelect, onPieceDrop, onSquareClick are UNCHANGED from previous version)
// //     const isDraggablePiece = useCallback(({ piece }) => {
// //     if (!game || game.isGameOver() || isGameLoading) return false;
// //     const pieceColor = piece[0];
// //     const pieceOwnerTurn = pieceColor === 'w' ? 'white' : 'black';
// //     if (aiEnabled) {
// //         const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// //         const isHumanPiece = pieceOwnerTurn === humanPlayerColor;
// //         return isHumanTurn && isHumanPiece;
// //     } else { return game.turn() === pieceColor; } // P&P: only current turn's pieces
// //   }, [game, aiEnabled, isGameLoading, humanPlayerColor]);

// //   const onPromotionCheck = useCallback((sourceSquare, targetSquare, piece) => {
// //     if (!game || isGameLoading || !piece || piece[1].toLowerCase() !== 'p') return false;
// //     return checkIsPromotion(sourceSquare, targetSquare);
// //   }, [checkIsPromotion, game, isGameLoading]);

// //   const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
// //     if (!game || isGameLoading || !piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
// //     const promotionPiece = piece[1].toLowerCase();
// //     const fromSq = promoteFromSquare ?? pendingManualPromotion?.from;
// //     const toSq = promoteToSquare ?? pendingManualPromotion?.to;
// //     if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
// //     const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece });
// //     if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
// //   }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

// //   const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
// //     if (!game || isGameLoading || game.isGameOver()) return false;
// //     const pieceColor = pieceString[0];
// //     const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
// //     if (aiEnabled && !isHumanTurn) return false; // AI's turn
// //     if (!aiEnabled && game.turn() !== pieceColor) return false; // P&P wrong turn
// //     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
// //     if (isPromo) return true; // Let promotion dialog handle
// //     else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
// //   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

// //   const onSquareClick = useCallback((square) => {
// //     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;
// //     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return; // AI's turn

// //     if (!selectedSquare) {
// //         const piece = game.get(square);
// //         if (piece && piece.color === game.turn()) {
// //             const moves = game.moves({ square: square, verbose: true });
// //             if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
// //             else { setSelectedSquare(null); setHighlightedSquares([]); }
// //         } else { setSelectedSquare(null); setHighlightedSquares([]); }
// //     } else {
// //         if (square === selectedSquare) { setSelectedSquare(null); setHighlightedSquares([]); return; }
// //         if (highlightedSquares.includes(square)) {
// //             const isPromo = checkIsPromotion(selectedSquare, square);
// //             if (isPromo) {
// //                 setPendingManualPromotion({ from: selectedSquare, to: square }); setPromotionDialogOpen(true);
// //                 setSelectedSquare(null); setHighlightedSquares([]);
// //             } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); }
// //         } else {
// //             const piece = game.get(square);
// //             if (piece && piece.color === game.turn()) {
// //                 const moves = game.moves({ square: square, verbose: true });
// //                 if (moves.length > 0) { setSelectedSquare(square); setHighlightedSquares(moves.map((m) => m.to)); }
// //                 else { setSelectedSquare(null); setHighlightedSquares([]); }
// //             } else { setSelectedSquare(null); setHighlightedSquares([]); }
// //         }
// //     }
// //   }, [game, selectedSquare, highlightedSquares, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, promotionDialogOpen, isGameLoading]);


// //   // --- Control Button Functions (Use fixed humanPlayerColor, no changes to it) ---
// //   // (resetGame, undoMove, forwardMove are UNCHANGED from previous version)
// //   const resetGame = useCallback(() => {
// //     console.log("Resetting game.");
// //     const newGame = initialFen ? new Chess(initialFen) : new Chess();
// //     const initialTurn = newGame.turn();
// //     const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
// //     console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed).`);
// //     setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
// //     setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
// //     setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
// //     const storageKey = getStorageKey(initialFen);
// //     try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
// //   }, [updateGameStatus, initialFen]);

// //   const undoMove = useCallback(() => {
// //     if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
// //     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
// //     if (moveHistory.length < movesToUndo || game.isGameOver()) return;
// //     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
// //     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
// //     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
// //     setForwardMoves((prev) => [...undoneMoves, ...prev]);
// //     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
// //     try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
// //     console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
// //     setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
// //     const storageKey = getStorageKey(initialFen);
// //     try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
// //     if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
// //     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// //   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);

// //   const forwardMove = useCallback(() => {
// //     if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
// //     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
// //     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
// //     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
// //     const redoSANs = forwardMoves.slice(0, movesToRedo);
// //     const remainingForwardMoves = forwardMoves.slice(movesToRedo);
// //     const tempGame = new Chess(game.fen());
// //     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", e); setForwardMoves([]); return; }
// //     const nextHistory = [...moveHistory, ...redoSANs];
// //     console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
// //     setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
// //     const storageKey = getStorageKey(initialFen);
// //     try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
// //     setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
// //     if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
// //     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
// //   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);


// //   // --- AI Logic (Uses fixed humanPlayerColor) ---
// //   // (fetchBestMove, useEffect are UNCHANGED from previous version)
// //     const fetchBestMove = useCallback(async (currentFen) => {
// //     const depth = 4;
// //     const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=${depth}`;
// //     console.log(`[fetchBestMove] Fetching AI move (Depth: ${depth})...`);
// //     try {
// //         const res = await fetch(url); if (!res.ok) throw new Error(`API error: ${res.status}`);
// //         const data = await res.json();
// //         if (data.success && data.bestmove && typeof data.bestmove === 'string') {
// //             const bestMoveString = data.bestmove.split(" ")[1];
// //             if (bestMoveString && bestMoveString.length >= 4) {
// //               const from = bestMoveString.slice(0, 2); const to = bestMoveString.slice(2, 4);
// //               const promotion = bestMoveString.length === 5 ? bestMoveString.slice(4, 5) : undefined;
// //               return { from, to, promotion };
// //             } else { console.error("[fetchBestMove] Invalid bestmove format:", data.bestmove); return null; }
// //         } else { console.error("[fetchBestMove] Stockfish API error:", data); return null; }
// //     } catch (err) { console.error("[fetchBestMove] Network/API fetch error:", err); return null; }
// //   }, []);

// //   useEffect(() => {
// //     if (!game || game.isGameOver() || isGameLoading) return;
// //     const isAITurn = game.turn() !== humanPlayerColor.charAt(0);
// //     let timeoutId = null;
// //     if (aiEnabled && !pauseAi && isAITurn) {
// //       const currentFen = game.fen(); console.log(`[AI Effect] AI turn (${game.turn()}). Scheduling fetch...`);
// //       setIsAiThinking(true);
// //       timeoutId = setTimeout(async () => {
// //         const stillValidToFetch = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// //         if (stillValidToFetch) {
// //           console.log("[AI Effect] Fetching for FEN:", currentFen); const bestMove = await fetchBestMove(currentFen);
// //           const stillValidToApply = aiEnabled && !pauseAi && game?.fen() === currentFen && game?.turn() !== humanPlayerColor.charAt(0) && !game?.isGameOver();
// //           if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); }
// //           else { console.log("[AI Effect] AI move aborted."); }
// //         } else { console.log("[AI Effect] AI fetch aborted."); }
// //         setIsAiThinking(false);
// //       }, 1000);
// //     } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking."); setIsAiThinking(false); }
// //     return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) setIsAiThinking(false); } };
// //   }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


// //   // --- Auto-scroll Move History (Unchanged) ---
// //   useEffect(() => {
// //     if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
// //   }, [moveHistory]);


// //   // --- Helper to generate custom square styles (Unchanged) ---
// //   const getCustomSquareStyles = useCallback(() => {
// //     const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
// //     highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
// //     if (selectedSquare) { styles[selectedSquare] = { backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
// //     if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
// //   }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


// //   // --- Render (Uses fixed boardOrientation, MODIFIED History Display) ---
// //   return (
// //     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

// //       {/* --- Chessboard Area (Uses fixed orientation) --- */}
// //       <Box borderRadius="lg" p={4} bg={boardContainerBg} boxShadow="xl" border="1px" borderColor={boardBorderColor}>
// //         {/* Header */}
// //         <Flex justify="space-between" align="center" mb={3} px={1}>
// //           <Flex align="center" minH="28px" flexShrink={1} overflow="hidden" mr={3}>
// //             {(isGameLoading || isAiThinking) && <Spinner color="teal.500" size="sm" mr={2} speed="0.7s"/>}
// //             <Text fontSize="xl" fontWeight="bold" noOfLines={1} title={statusText} color={statusTextColor}>
// //               {isGameLoading ? "Loading Game..." : statusText}
// //             </Text>
// //           </Flex>
// //           <HStack spacing={3} align="center" flexShrink={0}>
// //             <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
// //               {aiEnabled ? `vs AI (${humanPlayerColor === 'white' ? 'Black' : 'White'})` : "Pass & Play"}
// //             </Text>
// //             <Switch id="ai-switch" colorScheme="teal" isChecked={aiEnabled} onChange={(e) => { const isEnabling = e.target.checked; setAiEnabled(isEnabling); if (isEnabling) setPauseAi(false); else setIsAiThinking(false); }} isDisabled={isGameLoading || game?.isGameOver() || isAiThinking} size="md"/>
// //           </HStack>
// //         </Flex>

// //         {/* The Chessboard Component */}
// //         {isGameLoading ? (
// //             <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
// //                 <Text color={statusTextColor}>Loading Board...</Text>
// //             </Box>
// //         ) : (
// //             <Chessboard id="PlayerVsAiBoard" position={fen} isDraggablePiece={isDraggablePiece} onPieceDrop={onPieceDrop} onSquareClick={onSquareClick} onPromotionCheck={onPromotionCheck} onPromotionPieceSelect={handlePromotionPieceSelect} showPromotionDialog={promotionDialogOpen} promotionToSquare={pendingManualPromotion?.to ?? null} promotionDialogVariant="modal"
// //               boardOrientation={humanPlayerColor} boardWidth={420} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
// //         )}
// //       </Box>

// //       {/* --- Sidebar Area (MODIFIED History Display Logic & Height) --- */}
// //       <VStack align="stretch" spacing={5} width="220px" pt={1}>
// //         {/* Controls Section */}
// //         <VStack align="stretch" spacing={3}>
// //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
// //              <HStack spacing={3}>
// //                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
// //                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
// //              </HStack>
// //              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
// //         </VStack>
// //         <Divider />

// //         {/* Move History Section (MODIFIED DISPLAY LOGIC & HEIGHT) */}
// //          <VStack align="stretch" spacing={2}>
// //              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
// //             <Box
// //               ref={moveHistoryRef}
// //               // **** MODIFIED HEIGHT ****
// //               h="300px" // Reduced height
// //               w="100%"
// //               overflowY="auto"
// //               bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
// //               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
// //             >
// //               {isGameLoading ? (
// //                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
// //               ) : // **** DISPLAY LOGIC STARTS HERE ****
// //                 // Check if we need to render the first row placeholder immediately
// //                 (humanPlayerColor === 'black' && moveHistory.length === 0) ? (
// //                     // Case: Human is Black, NO moves made yet -> Show placeholder row 1
// //                     <VStack spacing={1} align="stretch">
// //                         <Flex key={1} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap">
// //                             <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>1.</Text>
// //                             <Text minW="55px" px={1} color={placeholderMoveColor} title="White move 1: (skipped)" visibility="visible">...</Text>
// //                             <Text minW="55px" px={1} visibility="hidden"></Text> {/* Empty black slot */}
// //                         </Flex>
// //                     </VStack>
// //                 ) : (moveHistory.length === 0) ? (
// //                     // Case: Human is White, NO moves made yet -> Show empty message
// //                     <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
// //                 ) : (
// //                 // Case: Moves exist, render them based on logic
// //                  <VStack spacing={1} align="stretch">
// //                     {/* Calculate number of rows needed */}
// //                     {Array.from({ length: Math.ceil(moveHistory.length / 2) + (humanPlayerColor === 'black' ? 1 : 0) - (humanPlayerColor==='black' && moveHistory.length>0 ? 1:0)}).map((_, i) => {
// //                         const moveNumber = i + 1;
// //                         // Get moves from the *actual* history array (always W, B, W, B...)
// //                         const whiteMoveIndex = i * 2;
// //                         const blackMoveIndex = i * 2 + 1;
// //                         const whiteMoveSAN = moveHistory[whiteMoveIndex]; // Might be undefined
// //                         const blackMoveSAN = moveHistory[blackMoveIndex]; // Might be undefined

// //                         // Determine if these were the *absolute* last moves made overall
// //                         const isLastWhite = whiteMoveIndex === moveHistory.length - 1;
// //                         const isLastBlack = blackMoveIndex === moveHistory.length - 1;

// //                         // **** CONDITIONAL DISPLAY LOGIC ****
// //                         let displayWhiteMove, displayBlackMove;
// //                         let isWhiteSlotLast, isBlackSlotLast;
// //                         let whiteSlotTitle, blackSlotTitle;
// //                         let whiteSlotVisibility = 'hidden';
// //                         let blackSlotVisibility = 'hidden';
// //                         let usePlaceholderStyle = false;

// //                         // Check if human is black AND it's the first move row
// //                         if (humanPlayerColor === 'black' && moveNumber === 1) {
// //                             // **Special Case: Human is Black, First Row**
// //                             displayWhiteMove = "..."; // Always show placeholder for white
// //                             displayBlackMove = blackMoveSAN; // Show black's move when available
// //                             whiteSlotVisibility = 'visible'; // Make placeholder visible
// //                             blackSlotVisibility = blackMoveSAN ? 'visible' : 'hidden'; // Show black only if it exists
// //                             isWhiteSlotLast = false; // Placeholder isn't the last move
// //                             isBlackSlotLast = isLastBlack; // Black's actual move could be last
// //                             whiteSlotTitle = "White move 1: (skipped)";
// //                             blackSlotTitle = blackMoveSAN ? `Black move 1: ${blackMoveSAN}` : '';
// //                             usePlaceholderStyle = true; // Style the placeholder
// //                         } else {
// //                             // **Default Case: Human is White OR Row > 1**
// //                             displayWhiteMove = whiteMoveSAN;
// //                             displayBlackMove = blackMoveSAN;
// //                             whiteSlotVisibility = whiteMoveSAN ? 'visible' : 'hidden';
// //                             blackSlotVisibility = blackMoveSAN ? 'visible' : 'hidden';
// //                             isWhiteSlotLast = isLastWhite;
// //                             isBlackSlotLast = isLastBlack;
// //                             whiteSlotTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}` : '';
// //                             blackSlotTitle = blackMoveSAN ? `Black move ${moveNumber}: ${blackMoveSAN}` : '';
// //                         }

// //                         return (
// //                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
// //                              {/* Move Number */}
// //                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>

// //                              {/* White Move Slot (or Placeholder) */}
// //                              <Text
// //                                 minW="55px" px={1}
// //                                 fontWeight={isWhiteSlotLast ? 'extrabold': 'normal'}
// //                                 color={usePlaceholderStyle ? placeholderMoveColor : (isWhiteSlotLast ? lastMoveColor : defaultMoveColor)}
// //                                 title={whiteSlotTitle}
// //                                 visibility={whiteSlotVisibility}
// //                              >
// //                                {displayWhiteMove ?? ""}
// //                              </Text>

// //                              {/* Black Move Slot */}
// //                              <Text
// //                                 minW="55px" px={1}
// //                                 fontWeight={isBlackSlotLast ? 'extrabold': 'normal'}
// //                                 color={isBlackSlotLast ? lastMoveColor : defaultMoveColor}
// //                                 visibility={blackSlotVisibility}
// //                                 title={blackSlotTitle}
// //                              >
// //                                {displayBlackMove ?? ""}
// //                              </Text>
// //                           </Flex>
// //                         )
// //                     })}
// //                  </VStack>
// //               )}
// //             </Box>
// //          </VStack>
// //       </VStack>
// //     </HStack>
// //   );
// // };

// // export default ChessGame;


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
//   const [moveHistory, setMoveHistory] = useState([]); // Stores moves sequentially: [w1, b1, w2, b2, ...]
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

//   // --- Refs (Unchanged) ---
//   const moveHistoryRef = useRef(null);

//   // --- UI Styling Values (Unchanged except placeholder color if needed) ---
//   const pageBg = useColorModeValue("gray.100", "gray.800");
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
//   const placeholderMoveColor = useColorModeValue("gray.500", "gray.400"); // Adjusted for visibility
//   const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
//   const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
//   const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
//   const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
//   const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
//   const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

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

//   // --- Load Game on Mount (Sets fixed player color) ---
//   // (useEffect logic for loading game state is UNCHANGED from previous version)
//   useEffect(() => {
//     console.log("Attempting to initialize game state...");
//     let loadedGame = null;
//     let loadedHistory = [];
//     let loadSource = "";
//     const storageKey = getStorageKey(initialFen);

//     if (initialFen) {
//       loadSource = "initialFen prop";
//       console.log(`Initializing game from provided initialFen: ${initialFen}`);
//       try {
//         loadedGame = new Chess(initialFen);
//         if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
//         loadedHistory = [];
//         console.log("Successfully initialized game from initialFen.");
//         try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
//       } catch (fenError) {
//         console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
//         loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
//       }
//     } else {
//       loadSource = "localStorage attempt";
//       console.log("No initialFen. Attempting load from storage...");
//       try {
//         const storedHistoryString = localStorage.getItem(storageKey);
//         if (storedHistoryString) {
//           const parsedHistory = JSON.parse(storedHistoryString);
//           if (Array.isArray(parsedHistory)) {
//             loadedGame = new Chess(); // Start fresh
//             try {
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
//     setMoveHistory(loadedHistory); // History is always [w1, b1, w2, b2...]
//     updateGameStatus(loadedGame);

//     const initialTurn = loadedGame.turn();
//     const playerColor = initialTurn === 'w' ? 'white' : 'black';
//     setHumanPlayerColor(playerColor); // Fixed after this point
//     console.log(`Game loaded. Initial Turn: ${initialTurn}. Human Player controls: ${playerColor}.`);

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
//     } else { return game.turn() === pieceColor; } // P&P: only current turn's pieces
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
//     if (aiEnabled && !isHumanTurn) return false; // AI's turn
//     if (!aiEnabled && game.turn() !== pieceColor) return false; // P&P wrong turn
//     const isPromo = checkIsPromotion(sourceSquare, targetSquare);
//     if (isPromo) return true; // Let promotion dialog handle
//     else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
//   }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

//   const onSquareClick = useCallback((square) => {
//     if (!game || game.isGameOver() || promotionDialogOpen || isGameLoading) return;
//     if (aiEnabled && game.turn() !== humanPlayerColor.charAt(0)) return; // AI's turn

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


//   // --- Control Button Functions (Use fixed humanPlayerColor, no changes to it) ---
//   // (resetGame, undoMove, forwardMove are UNCHANGED from previous version)
//   const resetGame = useCallback(() => {
//     console.log("Resetting game.");
//     const newGame = initialFen ? new Chess(initialFen) : new Chess();
//     const initialTurn = newGame.turn();
//     const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
//     console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed).`);
//     setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
//     setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
//     setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
//   }, [updateGameStatus, initialFen]);

//   const undoMove = useCallback(() => {
//     if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
//     const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
//     if (moveHistory.length < movesToUndo || game.isGameOver()) return;
//     console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
//     const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
//     const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
//     setForwardMoves((prev) => [...undoneMoves, ...prev]);
//     const baseGame = initialFen ? new Chess(initialFen) : new Chess();
//     try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
//     console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
//     setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
//     if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
//     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
//   }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);

//   const forwardMove = useCallback(() => {
//     if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
//     const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
//     if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
//     console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
//     const redoSANs = forwardMoves.slice(0, movesToRedo);
//     const remainingForwardMoves = forwardMoves.slice(movesToRedo);
//     const tempGame = new Chess(game.fen());
//     try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", e); setForwardMoves([]); return; }
//     const nextHistory = [...moveHistory, ...redoSANs];
//     console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed).`);
//     setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
//     const storageKey = getStorageKey(initialFen);
//     try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
//     setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
//     if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
//     setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
//   }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor]);


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
//     <HStack align="start" spacing={6} p={5} bg={pageBg} minH="100vh">

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
//               boardOrientation={humanPlayerColor} boardWidth={420} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
//         )}
//       </Box>

//       {/* --- Sidebar Area (MODIFIED History Display Logic & Height) --- */}
//       <VStack align="stretch" spacing={5} width="220px" pt={1}>
//         {/* Controls Section */}
//         <VStack align="stretch" spacing={3}>
//              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Controls</Text>
//              <HStack spacing={3}>
//                <Button colorScheme="orange" variant="outline" onClick={undoMove} isDisabled={isGameLoading || isAiThinking || moveHistory.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Undo </Button>
//                <Button colorScheme="cyan" variant="outline" onClick={forwardMove} isDisabled={isGameLoading || isAiThinking || forwardMoves.length < 1 || game?.isGameOver()} size="sm" flexGrow={1}> Redo </Button>
//              </HStack>
//              <Button colorScheme="red" variant="solid" onClick={resetGame} isDisabled={isGameLoading || isAiThinking} size="sm" width="100%"> Reset Game </Button>
//         </VStack>
//         <Divider />

//         {/* Move History Section (MODIFIED DISPLAY LOGIC & HEIGHT) */}
//          <VStack align="stretch" spacing={2}>
//              <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
//             <Box
//               ref={moveHistoryRef}
//               // **** MODIFIED HEIGHT ****
//               h="300px" // Reduced height
//               w="100%"
//               overflowY="auto"
//               bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
//               sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
//             >
//               {isGameLoading ? (
//                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
//               ) : // **** DISPLAY LOGIC REFINED ****
//                 (moveHistory.length === 0 && humanPlayerColor === 'white') ? (
//                   // Case 1: Human is White, NO moves made yet -> Show empty message
//                   <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
//                 ) : (
//                 // Case 2: Human is Black OR moves exist -> Render list (potentially starting with placeholder)
//                  <VStack spacing={1} align="stretch">
//                     {/* Calculate number of rows needed. Add 1 for the initial placeholder row if needed */}
//                     {Array.from({ length: Math.max(1, Math.ceil(moveHistory.length / 2)) }).map((_, i) => {
//                         const moveNumber = i + 1;
//                         // Get moves from the *actual* history array (always W, B, W, B...)
//                         const whiteMoveIndex = i * 2;
//                         const blackMoveIndex = i * 2 + 1;
//                         const whiteMoveSAN = moveHistory[whiteMoveIndex]; // Might be undefined
//                         const blackMoveSAN = moveHistory[blackMoveIndex]; // Might be undefined

//                         // Determine if these were the *absolute* last moves made overall
//                         const isLastWhite = whiteMoveIndex === moveHistory.length - 1;
//                         const isLastBlack = blackMoveIndex === moveHistory.length - 1;

//                         // **** CONDITIONAL DISPLAY LOGIC ****
//                         let displayWhiteMove, displayBlackMove;
//                         let isWhiteSlotLast, isBlackSlotLast;
//                         let whiteSlotTitle, blackSlotTitle;
//                         let whiteSlotVisibility = 'hidden';
//                         let blackSlotVisibility = 'hidden';
//                         let usePlaceholderStyle = false;

//                         // Check if human is black AND it's the first move row
//                         if (humanPlayerColor === 'black' && moveNumber === 1) {
//                             // **Special Case: Human is Black, First Row**
//                             displayWhiteMove = "..."; // Always show placeholder for white
//                             displayBlackMove = blackMoveSAN; // Show black's move when available
//                             whiteSlotVisibility = 'visible'; // Make placeholder visible always for row 1
//                             blackSlotVisibility = blackMoveSAN ? 'visible' : 'hidden'; // Show black only if it exists
//                             isWhiteSlotLast = false; // Placeholder isn't the last move
//                             isBlackSlotLast = isLastBlack; // Black's actual move could be last
//                             whiteSlotTitle = "White move 1: (skipped)";
//                             blackSlotTitle = blackMoveSAN ? `Black move 1: ${blackMoveSAN}` : '';
//                             usePlaceholderStyle = true; // Style the placeholder
//                         } else {
//                             // **Default Case: Human is White OR Row > 1**
//                             displayWhiteMove = whiteMoveSAN;
//                             displayBlackMove = blackMoveSAN;
//                             whiteSlotVisibility = whiteMoveSAN ? 'visible' : 'hidden';
//                             blackSlotVisibility = blackMoveSAN ? 'visible' : 'hidden';
//                             isWhiteSlotLast = isLastWhite;
//                             isBlackSlotLast = isLastBlack;
//                             whiteSlotTitle = whiteMoveSAN ? `White move ${moveNumber}: ${whiteMoveSAN}` : '';
//                             blackSlotTitle = blackMoveSAN ? `Black move ${moveNumber}: ${blackMoveSAN}` : '';
//                         }

//                         // *** Edge Case Correction: Don't render future empty rows ***
//                         // If both display slots are effectively empty for this row number, don't render the row.
//                         // (Except for the initial placeholder row 1 when human is black)
//                         if (!displayWhiteMove && !displayBlackMove && !(humanPlayerColor === 'black' && moveNumber === 1)) {
//                            return null; // Skip rendering this empty future row
//                         }


//                         return (
//                           <Flex key={moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
//                              {/* Move Number */}
//                              <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{moveNumber}.</Text>

//                              {/* White Move Slot (or Placeholder) */}
//                              <Text
//                                 minW="55px" px={1}
//                                 fontWeight={isWhiteSlotLast ? 'extrabold': 'normal'}
//                                 color={usePlaceholderStyle ? placeholderMoveColor : (isWhiteSlotLast ? lastMoveColor : defaultMoveColor)}
//                                 title={whiteSlotTitle}
//                                 visibility={whiteSlotVisibility}
//                              >
//                                {displayWhiteMove ?? ""}
//                              </Text>

//                              {/* Black Move Slot */}
//                              <Text
//                                 minW="55px" px={1}
//                                 fontWeight={isBlackSlotLast ? 'extrabold': 'normal'}
//                                 color={isBlackSlotLast ? lastMoveColor : defaultMoveColor}
//                                 visibility={blackSlotVisibility}
//                                 title={blackSlotTitle}
//                              >
//                                {displayBlackMove ?? ""}
//                              </Text>
//                           </Flex>
//                         )
//                     })}
//                  </VStack>
//               )}
//             </Box>
//          </VStack>
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
// Helper function to get the appropriate storage key based on FEN
const getStorageKey = (fen) => fen ? `${LOCAL_STORAGE_KEY}_${fen}` : LOCAL_STORAGE_KEY;


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
const ChessGame = ({ initialFen }) => {
  // --- State ---
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState(initialFen || "start");
  const [moveHistory, setMoveHistory] = useState([]); // Stores moves sequentially: [w1, b1, w2, b2, ...] OR [b1, w1, b2, w2, ...] if black starts
  const [forwardMoves, setForwardMoves] = useState([]);
  const [humanPlayerColor, setHumanPlayerColor] = useState("white"); // Determined once on load
  const [aiEnabled, setAiEnabled] = useState(true);
  const [pauseAi, setPauseAi] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [statusText, setStatusText] = useState("Loading Game...");
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [pendingManualPromotion, setPendingManualPromotion] = useState(null);
  const [isGameLoading, setIsGameLoading] = useState(true);
  // **** ADDED: State to track if the game started with black to move ****
  const [startedWithBlackMove, setStartedWithBlackMove] = useState(false);

  // --- Refs (Unchanged) ---
  const moveHistoryRef = useRef(null);

  // --- UI Styling Values ---
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
  const defaultMoveColor = useColorModeValue("gray.700", "gray.300");
  const placeholderMoveColor = useColorModeValue("gray.500", "gray.400");
  const customDarkSquareStyle = useColorModeValue( { backgroundColor: '#A98A6E' }, { backgroundColor: '#6E5B4B' } );
  const customLightSquareStyle = useColorModeValue( { backgroundColor: '#F2E1CD' }, { backgroundColor: '#B3A18F' } );
  const selectedSquareColor = useColorModeValue( "rgba(34, 139, 34, 0.5)", "rgba(46, 160, 67, 0.5)" );
  const legalMoveDotColor = useColorModeValue( "rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.25)" );
  const captureSquareColor = useColorModeValue( "rgba(255, 99, 71, 0.4)", "rgba(255, 127, 80, 0.45)" );
  const checkHighlightColor = useColorModeValue( "rgba(220, 20, 60, 0.7)", "rgba(255, 69, 0, 0.7)" );

  // --- Utility Functions (Unchanged) ---
  const checkIsPromotion = useCallback((from, to) => checkIsPromotionFn(game, from, to), [game]);
  const updateGameStatus = useCallback((currentGame) => {
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

  // --- Load Game on Mount (Sets fixed player color AND if black started) ---
  useEffect(() => {
    console.log("Attempting to initialize game state...");
    let loadedGame = null;
    let loadedHistory = [];
    let loadSource = "";
    const storageKey = getStorageKey(initialFen);
    let blackToMoveInitially = false; // Flag to track initial turn

    // Logic to load game from initialFen or localStorage (UNCHANGED logic, just added flag setting)
    if (initialFen) {
      loadSource = "initialFen prop";
      console.log(`Initializing game from provided initialFen: ${initialFen}`);
      try {
        loadedGame = new Chess(initialFen);
        if (!loadedGame || !loadedGame.fen()) throw new Error("Invalid FEN");
        blackToMoveInitially = loadedGame.turn() === 'b'; // Check initial turn from FEN
        loadedHistory = [];
        console.log("Successfully initialized game from initialFen.");
        try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}) due to initialFen.`); } catch (e) { console.error("Failed to clear storage:", e); }
      } catch (fenError) {
        console.error(`ERROR: Invalid initialFen: "${initialFen}". ${fenError.message}. Falling back.`);
        loadedGame = new Chess(); loadedHistory = []; loadSource = "initialFen error fallback";
        blackToMoveInitially = false; // Default start is White's move
      }
    } else {
      loadSource = "localStorage attempt";
      console.log("No initialFen. Attempting load from storage...");
       blackToMoveInitially = false; // Assume White starts if loading history (or new game)
      try {
        const storedHistoryString = localStorage.getItem(storageKey);
        if (storedHistoryString) {
          const parsedHistory = JSON.parse(storedHistoryString);
          if (Array.isArray(parsedHistory)) {
            loadedGame = new Chess(); // Start fresh
            try {
              // **** Important: If replaying history, the initial state is always White's move ****
              // The current turn will reflect the state *after* replay.
              parsedHistory.forEach(san => loadedGame.move(san));
              console.log("Successfully replayed history from storage.");
              loadedHistory = parsedHistory; loadSource = "localStorage success";
            } catch (replayError) {
              console.error("Error replaying stored history:", replayError);
              localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage replay error";
            }
          } else { /* Handle non-array stored data */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage format error"; }
        } else { /* No stored history */ loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage empty"; }
      } catch (parseError) { /* Handle JSON parse error */ localStorage.removeItem(storageKey); loadedGame = new Chess(); loadedHistory = []; loadSource = "localStorage parse error"; }
    }

    setGame(loadedGame);
    setFen(loadedGame.fen());
    setMoveHistory(loadedHistory);
    updateGameStatus(loadedGame);

    // Set human player color based on *current* turn after load/replay
    const currentTurn = loadedGame.turn();
    const playerColor = currentTurn === 'w' ? 'white' : 'black';
    setHumanPlayerColor(playerColor); // Fixed after this point

    // **** Set the flag indicating if the game *started* with Black to move ****
    setStartedWithBlackMove(blackToMoveInitially);
    console.log(`Game loaded. Current Turn: ${currentTurn}. Human Player controls: ${playerColor}. Started w/ Black move: ${blackToMoveInitially}`);

    setIsGameLoading(false);
    console.log(`Game loading complete. Source: ${loadSource}`);
  }, [initialFen, updateGameStatus]);


  // --- Core Game Logic (Saves history normally) ---
  // (makeMove logic is UNCHANGED from previous version)
  const makeMove = useCallback((move) => {
    if (!game) return false;
    let moveResult = null; let success = false; const tempGame = new Chess(game.fen());
    try { moveResult = tempGame.move(move); } catch (e) { console.error("Error making move:", e); moveResult = null; }
    if (moveResult) {
      console.log(`[makeMove] Success: ${moveResult.san}`);
      setGame(tempGame); setFen(tempGame.fen());
      setMoveHistory((prev) => {
          const nextHistory = [...prev, moveResult.san]; // Append normally
          const storageKey = getStorageKey(initialFen);
          try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved (${storageKey})`); } catch (e) { console.error("Failed to save history:", e); }
          return nextHistory; // Return standard sequence
      });
      setForwardMoves([]); updateGameStatus(tempGame); if (aiEnabled) setPauseAi(false); success = true;
    } else { console.log("[makeMove] Failed (Illegal Move/Error):", move); success = false; }
    setSelectedSquare(null); setHighlightedSquares([]); return success;
  }, [game, updateGameStatus, aiEnabled, initialFen]);


  // --- react-chessboard Callbacks (Use fixed humanPlayerColor) ---
  // (isDraggablePiece, onPromotionCheck, handlePromotionPieceSelect, onPieceDrop, onSquareClick are UNCHANGED from previous version)
    const isDraggablePiece = useCallback(({ piece }) => {
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
    if (!game || isGameLoading || !piece || piece[1].toLowerCase() !== 'p') return false;
    return checkIsPromotion(sourceSquare, targetSquare);
  }, [checkIsPromotion, game, isGameLoading]);

  const handlePromotionPieceSelect = useCallback((piece, promoteFromSquare, promoteToSquare) => {
    if (!game || isGameLoading || !piece) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); setSelectedSquare(null); setHighlightedSquares([]); } return false; }
    const promotionPiece = piece[1].toLowerCase();
    const fromSq = promoteFromSquare ?? pendingManualPromotion?.from;
    const toSq = promoteToSquare ?? pendingManualPromotion?.to;
    if (!promotionPiece || !fromSq || !toSq) { if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return false; }
    const success = makeMove({ from: fromSq, to: toSq, promotion: promotionPiece });
    if (promotionDialogOpen) { setPromotionDialogOpen(false); setPendingManualPromotion(null); } return success;
  }, [makeMove, promotionDialogOpen, pendingManualPromotion, game, isGameLoading]);

  const onPieceDrop = useCallback((sourceSquare, targetSquare, pieceString) => {
    if (!game || isGameLoading || game.isGameOver()) return false;
    const pieceColor = pieceString[0];
    const isHumanTurn = game.turn() === humanPlayerColor.charAt(0);
    if (aiEnabled && !isHumanTurn) return false;
    if (!aiEnabled && game.turn() !== pieceColor) return false;
    const isPromo = checkIsPromotion(sourceSquare, targetSquare);
    if (isPromo) return true;
    else return makeMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
  }, [game, humanPlayerColor, aiEnabled, checkIsPromotion, makeMove, isGameLoading]);

  const onSquareClick = useCallback((square) => {
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
            } else { makeMove({ from: selectedSquare, to: square, promotion: 'q' }); }
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


  // --- Control Button Functions (Use fixed humanPlayerColor, reset added state) ---
  const resetGame = useCallback(() => {
    console.log("Resetting game.");
    const newGame = initialFen ? new Chess(initialFen) : new Chess();
    const initialTurn = newGame.turn();
    const expectedPlayerColor = initialTurn === 'w' ? 'white' : 'black';
    const blackStarted = initialTurn === 'b'; // Check if reset state starts with black
    console.log(`Game reset. Initial Turn: ${initialTurn}. Human controls: ${expectedPlayerColor} (fixed). Started w/ Black: ${blackStarted}`);
    setGame(newGame); setFen(newGame.fen()); setMoveHistory([]); setForwardMoves([]);
    setPauseAi(false); setIsAiThinking(false); setSelectedSquare(null); setHighlightedSquares([]);
    setPromotionDialogOpen(false); setPendingManualPromotion(null); updateGameStatus(newGame);
    // **** Reset the startedWithBlackMove flag based on the reset state ****
    setStartedWithBlackMove(blackStarted);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.removeItem(storageKey); console.log(`Cleared storage (${storageKey}).`); } catch (e) { console.error("Failed to clear storage:", e); }
  }, [updateGameStatus, initialFen]); // humanPlayerColor removed as dependency, it's fixed

  const undoMove = useCallback(() => {
    // Logic for undoing moves remains the same
    if (!game || isGameLoading || isAiThinking || moveHistory.length < 1) return;
    const movesToUndo = aiEnabled ? (moveHistory.length === 1 ? 1 : 2) : 1;
    if (moveHistory.length < movesToUndo || game.isGameOver()) return;
    console.log(`[Undo] Undoing last ${movesToUndo} half-move(s).`);
    const newHistory = moveHistory.slice(0, moveHistory.length - movesToUndo);
    const undoneMoves = moveHistory.slice(moveHistory.length - movesToUndo);
    setForwardMoves((prev) => [...undoneMoves, ...prev]);
    // Recreate game state - `startedWithBlackMove` remains unchanged as it refers to the *initial* FEN
    const baseGame = initialFen ? new Chess(initialFen) : new Chess();
    try { newHistory.forEach((san) => baseGame.move(san)); } catch (e) { console.error("[Undo] Error replaying history:", e); resetGame(); return; }
    console.log(`[Undo] State restored. Turn: ${baseGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
    setGame(baseGame); setFen(baseGame.fen()); setMoveHistory(newHistory);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.setItem(storageKey, JSON.stringify(newHistory)); console.log(`History saved after undo (${storageKey}).`); } catch (e) { console.error("Failed to save history after undo:", e); }
    if (aiEnabled) setPauseAi(true); setIsAiThinking(false); updateGameStatus(baseGame);
    setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
    // No need to change startedWithBlackMove here
  }, [aiEnabled, moveHistory, game, resetGame, updateGameStatus, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]); // Added startedWithBlackMove dependency for logging

  const forwardMove = useCallback(() => {
    // Logic for redoing moves remains the same
    if (!game || isGameLoading || isAiThinking || forwardMoves.length < 1) return;
    const movesToRedo = aiEnabled ? (forwardMoves.length === 1 ? 1 : 2) : 1;
    if (forwardMoves.length < movesToRedo || game.isGameOver()) return;
    console.log(`[Redo] Redoing ${movesToRedo} half-move(s).`);
    const redoSANs = forwardMoves.slice(0, movesToRedo);
    const remainingForwardMoves = forwardMoves.slice(movesToRedo);
    const tempGame = new Chess(game.fen());
    try { redoSANs.forEach(san => tempGame.move(san)); } catch(e) { console.error("[Redo] Error replaying forward moves:", e); setForwardMoves([]); return; }
    const nextHistory = [...moveHistory, ...redoSANs];
    console.log(`[Redo] State advanced. Turn: ${tempGame.turn()}. Human: ${humanPlayerColor} (fixed). Started w/ Black: ${startedWithBlackMove}`);
    setGame(tempGame); setFen(tempGame.fen()); setMoveHistory(nextHistory);
    const storageKey = getStorageKey(initialFen);
    try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); console.log(`History saved after redo (${storageKey}).`); } catch (e) { console.error("Failed to save history after redo:", e); }
    setForwardMoves(remainingForwardMoves); updateGameStatus(tempGame);
    if (aiEnabled) setPauseAi(false); setIsAiThinking(false);
    setSelectedSquare(null); setHighlightedSquares([]); setPromotionDialogOpen(false); setPendingManualPromotion(null);
     // No need to change startedWithBlackMove here
  }, [aiEnabled, forwardMoves, game, updateGameStatus, moveHistory, isGameLoading, isAiThinking, initialFen, humanPlayerColor, startedWithBlackMove]); // Added startedWithBlackMove dependency for logging


  // --- AI Logic (Uses fixed humanPlayerColor) ---
  // (fetchBestMove, useEffect are UNCHANGED from previous version)
    const fetchBestMove = useCallback(async (currentFen) => {
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
          if (bestMove && stillValidToApply) { console.log("[AI Effect] Applying AI move:", bestMove); makeMove(bestMove); }
          else { console.log("[AI Effect] AI move aborted."); }
        } else { console.log("[AI Effect] AI fetch aborted."); }
        setIsAiThinking(false);
      }, 1000);
    } else if (isAiThinking && (!aiEnabled || pauseAi || !isAITurn)) { console.log("[AI Effect] Conditions changed, stopping AI thinking."); setIsAiThinking(false); }
    return () => { if (timeoutId) { console.log("[AI Effect Cleanup] Clearing AI timeout."); clearTimeout(timeoutId); if (aiEnabled && !pauseAi && game?.turn() !== humanPlayerColor.charAt(0)) setIsAiThinking(false); } };
  }, [fen, game, aiEnabled, pauseAi, humanPlayerColor, fetchBestMove, makeMove, isGameLoading]);


  // --- Auto-scroll Move History (Unchanged) ---
  useEffect(() => {
    if (moveHistoryRef.current) { moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight; }
  }, [moveHistory]);


  // --- Helper to generate custom square styles (Unchanged) ---
  const getCustomSquareStyles = useCallback(() => {
    const styles = {}; if (!game) return styles; const kingSquare = findKingSquareFn(game); const isInCheck = game.inCheck();
    highlightedSquares.forEach((sq) => { const pieceOnTarget = game.get(sq); const isCapture = pieceOnTarget && pieceOnTarget.color !== game.turn(); if (isCapture) { styles[sq] = { backgroundColor: captureSquareColor }; } else { styles[sq] = { background: `radial-gradient(circle, ${legalMoveDotColor} 25%, transparent 30%)`, borderRadius: "50%", }; } });
    if (selectedSquare) { styles[selectedSquare] = { backgroundColor: selectedSquareColor, background: selectedSquareColor, borderRadius: 0, }; }
    if (isInCheck && kingSquare) { styles[kingSquare] = { backgroundColor: checkHighlightColor, }; } return styles;
  }, [ game, selectedSquare, highlightedSquares, selectedSquareColor, legalMoveDotColor, captureSquareColor, checkHighlightColor, ]);


  // --- Render (Uses fixed boardOrientation, MODIFIED History Display) ---
  return (
    <HStack align="start" spacing={6} p={5} bg={pageBg}>

      {/* --- Chessboard Area (Uses fixed orientation) --- */}
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
            <Box width="420px" height="420px" display="flex" alignItems="center" justifyContent="center">
                <Text color={statusTextColor}>Loading Board...</Text>
            </Box>
        ) : (
            <Chessboard id="PlayerVsAiBoard" position={fen} isDraggablePiece={isDraggablePiece} onPieceDrop={onPieceDrop} onSquareClick={onSquareClick} onPromotionCheck={onPromotionCheck} onPromotionPieceSelect={handlePromotionPieceSelect} showPromotionDialog={promotionDialogOpen} promotionToSquare={pendingManualPromotion?.to ?? null} promotionDialogVariant="modal"
              boardOrientation={humanPlayerColor} boardWidth={500} customSquareStyles={getCustomSquareStyles()} customDarkSquareStyle={customDarkSquareStyle} customLightSquareStyle={customLightSquareStyle} snapToCursor={true} animationDuration={150} />
        )}
      </Box>

      {/* --- Sidebar Area (MODIFIED History Display Logic & Height) --- */}
      <VStack align="stretch" spacing={5} width="220px" pt={1}>
        {/* Controls Section */}

        <Divider />

        {/* Move History Section (MODIFIED DISPLAY LOGIC & HEIGHT) */}
         <VStack align="stretch" spacing={2}>
             <Text fontSize="lg" fontWeight="bold" color={controlsTextColor}>Move History</Text>
            <Box
              ref={moveHistoryRef}
              h="350px" // Reduced height
              w="100%"
              overflowY="auto"
              bg={historyBg} p={3} borderRadius="md" boxShadow="md" border="1px" borderColor={historyBorderColor}
              sx={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: scrollbarTrackBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb': { background: scrollbarThumbBg, borderRadius: '4px' }, '&::-webkit-scrollbar-thumb:hover': { background: scrollbarThumbHoverBg } }}
            >
              {isGameLoading ? (
                  <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">Loading history...</Text> </Flex>
              ) : // **** DISPLAY LOGIC REVISED ****
                (moveHistory.length === 0 && !startedWithBlackMove) ? (
                  // Case 1: No moves AND White started -> "No moves yet"
                  <Flex justify="center" align="center" h="100%"> <Text color={historyTextColor} fontStyle="italic">No moves yet.</Text> </Flex>
                ) : (
                // Case 2: Moves exist OR Black started -> Render list
                 <VStack spacing={1} align="stretch">
                    {(() => { // Immediately invoked function to generate pairs
                        const pairs = [];
                        if (startedWithBlackMove) {
                            // **** Logic for Black starting ****
                            const blackFirstMove = moveHistory.length > 0 ? moveHistory[0] : undefined;
                            pairs.push({
                                moveNumber: 1,
                                white: "...", // Placeholder
                                black: blackFirstMove,
                                isWhiteLast: false,
                                isBlackLast: moveHistory.length === 1,
                                usePlaceholderStyle: true,
                            });
                            // Subsequent moves (w1, b2), (w2, b3), ...
                            for (let i = 1; i < moveHistory.length; i += 2) {
                                pairs.push({
                                    moveNumber: Math.floor(i / 2) + 2, // Move # 2, 3, ...
                                    white: moveHistory[i],      // White's move (w1, w2...) at index 1, 3...
                                    black: moveHistory[i + 1],  // Black's move (b2, b3...) at index 2, 4...
                                    isWhiteLast: i === moveHistory.length - 1,
                                    isBlackLast: (i + 1) === moveHistory.length - 1,
                                    usePlaceholderStyle: false,
                                });
                            }
                        } else {
                            // **** Logic for White starting (Standard) ****
                            for (let i = 0; i < moveHistory.length; i += 2) {
                                pairs.push({
                                    moveNumber: (i / 2) + 1,
                                    white: moveHistory[i],      // White's move (w1, w2...) at index 0, 2...
                                    black: moveHistory[i + 1],  // Black's move (b1, b2...) at index 1, 3...
                                    isWhiteLast: i === moveHistory.length - 1,
                                    isBlackLast: (i + 1) === moveHistory.length - 1,
                                    usePlaceholderStyle: false,
                                });
                            }
                        }
                        // Filter out potential empty pairs if history length is odd and white started
                        // (No, the loop condition handles this)

                        // If black started and no moves yet, pairs will just have the placeholder row
                        if (startedWithBlackMove && moveHistory.length === 0 && pairs.length === 0) {
                           pairs.push({ moveNumber: 1, white: "...", black: undefined, isWhiteLast: false, isBlackLast: false, usePlaceholderStyle: true });
                        }

                        // Now map the generated pairs
                        return pairs.map((item) => (
                            <Flex key={item.moveNumber} justify="start" align="center" fontSize="sm" py="2px" wrap="nowrap" >
                                {/* Move Number */}
                                <Text fontWeight="bold" minW="30px" textAlign="right" mr={2} color={historyMoveNumColor}>{item.moveNumber}.</Text>

                                {/* White Move Slot (or Placeholder) */}
                                <Text
                                    minW="55px" px={1}
                                    fontWeight={item.isWhiteLast ? 'extrabold': 'normal'}
                                    color={item.usePlaceholderStyle ? placeholderMoveColor : (item.isWhiteLast ? lastMoveColor : defaultMoveColor)}
                                    title={item.usePlaceholderStyle ? "White move 1: (skipped)" : (item.white ? `White move ${item.moveNumber}: ${item.white}`: '')}
                                    visibility={item.white ? 'visible' : 'hidden'}
                                >
                                    {item.white ?? ""}
                                </Text>

                                {/* Black Move Slot */}
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