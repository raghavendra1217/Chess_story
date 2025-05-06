// // // // import React, { useEffect, useState } from 'react';
// // // // import {
// // // //     Box, Heading, Text, Spinner, Flex,
// // // //     Button, Wrap, WrapItem, useToast
// // // // } from '@chakra-ui/react';
// // // // import { useParams } from 'react-router-dom';
// // // // import axios from 'axios';
// // // // import ChessGame from './ChessGame';

// // // // function MappingDetails() {
// // // //     const { storyId, mappingId } = useParams();
// // // //     const [story, setStory] = useState(null);
// // // //     const [mapping, setMapping] = useState(null);
// // // //     const [principle, setPrinciple] = useState(null);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [error, setError] = useState(null);
// // // //     const toast = useToast();

// // // //     const [originalFen, setOriginalFen] = useState(null);
// // // //     const [currentFen, setCurrentFen] = useState(null);
// // // //     const [activeFenSource, setActiveFenSource] = useState(null);
// // // //     const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);

// // // //     useEffect(() => {
// // // //         setLoading(true);
// // // //         setError(null);
// // // //         let principleId = null;

// // // //         const fetchData = async () => {
// // // //             try {
// // // //                 const storyRes = await axios.get(`http://localhost:5000/stories/${storyId}`);
// // // //                 setStory(storyRes.data);

// // // //                 const mappingRes = await axios.get(`http://localhost:5000/story-mappings/${storyId}`);
// // // //                 const foundMapping = mappingRes.data.find(m => m.mapping_id.toString() === mappingId.toString());
// // // //                 if (!foundMapping) throw new Error("Mapping not found");
// // // //                 setMapping(foundMapping);
// // // //                 principleId = foundMapping.principle_id;

// // // //                 if (principleId) {
// // // //                     const principleRes = await axios.get(`http://localhost:5000/principle/${principleId}`);
// // // //                     setPrinciple(principleRes.data);
// // // //                     if (principleRes.data.fen_with_move) {
// // // //                         setOriginalFen(principleRes.data.fen_with_move);
// // // //                         setCurrentFen(principleRes.data.fen_with_move);
// // // //                         setActiveFenSource('original');
// // // //                     }
// // // //                 }
// // // //             } catch (err) {
// // // //                 setError(err.message);
// // // //             } finally {
// // // //                 setLoading(false);
// // // //             }
// // // //         };

// // // //         fetchData();
// // // //     }, [storyId, mappingId]);

// // // //     const getCleanedPuzzleArray = (str) => {
// // // //         if (!str || typeof str !== 'string') return [];
// // // //         return str.trim().replace(/^\[|\]$/g, '').replace(/'/g, '').split(',').map(p => p.trim()).filter(Boolean);
// // // //     };

// // // //     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

// // // //     const handlePuzzleClick = async (puzzleId) => {
// // // //         if (activeFenSource === puzzleId) return;
// // // //         setIsPuzzleLoading(true);
// // // //         setActiveFenSource(puzzleId);

// // // //         try {
// // // //             const res = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
// // // //             if (res.data?.fen_with_move) {
// // // //                 setCurrentFen(res.data.fen_with_move);
// // // //                 toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000 });
// // // //             }
// // // //         } catch (err) {
// // // //             toast({ title: "Error Loading Puzzle", description: err.message, status: 'error', duration: 4000 });
// // // //         } finally {
// // // //             setIsPuzzleLoading(false);
// // // //         }
// // // //     };

// // // //     const handleOriginalFenClick = () => {
// // // //         if (activeFenSource === 'original' || !originalFen) return;
// // // //         setCurrentFen(originalFen);
// // // //         setActiveFenSource('original');
// // // //         toast({ title: "Loaded Original Position", status: 'info', duration: 2000 });
// // // //     };

// // // //     if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
// // // //     if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

// // // //     return (
// // // //         <Box px={{ base: 4, md: 10 }} py={8} maxW="100%" mx="auto">
// // // //             <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="flex-start">
                
// // // //                 {/* Left Column */}
// // // //                 <Box flex={{ base: "1", md: "1.2" }}>
// // // //                     <Heading mb={3}>{story.title}</Heading>
// // // //                     <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// // // //                     {/* Story Message */}
// // // //                     <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
// // // //                         <Heading size="sm" mb={2} color="blue.700">Story Message</Heading>
// // // //                         <Text color="gray.700">{mapping.story_text}</Text>
// // // //                     </Box>

// // // //                     {/* Principle */}
// // // //                     {principle && (
// // // //                         <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
// // // //                             <Heading size="sm" mb={2} color="blue.700">Principle</Heading>
// // // //                             <Text color="gray.700">{principle.principle}</Text>
// // // //                         </Box>
// // // //                     )}

// // // //                     {/* Load Position */}
// // // //                     <Box p={4} bg="blue.50" borderRadius="md">
// // // //                         <Heading size="xs" mb={3} textTransform="uppercase" color="blue.600">Load Position</Heading>
// // // //                         <Wrap spacing={3}>
// // // //                             {originalFen && (
// // // //                                 <WrapItem>
// // // //                                     <Button
// // // //                                         size="sm"
// // // //                                         bg={activeFenSource === 'original' ? 'teal.500' : 'gray.100'}
// // // //                                         color={activeFenSource === 'original' ? 'white' : 'gray.700'}
// // // //                                         borderWidth="2px"
// // // //                                         borderColor={activeFenSource === 'original' ? 'teal.500' : 'gray.300'}
// // // //                                         transition="all 0.2s"
// // // //                                         _hover={{
// // // //                                             bg: activeFenSource === 'original' ? 'teal.600' : 'teal.100',
// // // //                                             color: activeFenSource === 'original' ? 'white' : 'teal.700'
// // // //                                         }}
// // // //                                         _dark={{
// // // //                                             bg: activeFenSource === 'original' ? 'teal.500' : 'gray.700',
// // // //                                             color: activeFenSource === 'original' ? 'white' : 'gray.200',
// // // //                                             borderColor: activeFenSource === 'original' ? 'teal.500' : 'gray.600',
// // // //                                             _hover: {
// // // //                                                 bg: activeFenSource === 'original' ? 'teal.600' : 'teal.600',
// // // //                                                 color: 'teal.100'
// // // //                                             }
// // // //                                         }}
// // // //                                         onClick={handleOriginalFenClick}
// // // //                                         isLoading={isPuzzleLoading && activeFenSource === 'original'}
// // // //                                     >
// // // //                                         Position
// // // //                                     </Button>
// // // //                                 </WrapItem>
// // // //                             )}
// // // //                             {puzzles.map((puzzleId, index) => (
// // // //                                 <WrapItem key={index}>
// // // //                                     <Button
// // // //                                         size="sm"
// // // //                                         bg={activeFenSource === puzzleId ? 'teal.500' : 'gray.100'}
// // // //                                         color={activeFenSource === puzzleId ? 'white' : 'gray.700'}
// // // //                                         borderWidth="2px"
// // // //                                         borderColor={activeFenSource === puzzleId ? 'teal.500' : 'gray.300'}
// // // //                                         transition="all 0.2s"
// // // //                                         _hover={{
// // // //                                             bg: activeFenSource === puzzleId ? 'teal.600' : 'teal.100',
// // // //                                             color: activeFenSource === puzzleId ? 'white' : 'teal.700'
// // // //                                         }}
// // // //                                         _dark={{
// // // //                                             bg: activeFenSource === puzzleId ? 'teal.500' : 'gray.700',
// // // //                                             color: activeFenSource === puzzleId ? 'white' : 'gray.200',
// // // //                                             borderColor: activeFenSource === puzzleId ? 'teal.500' : 'gray.600',
// // // //                                             _hover: {
// // // //                                                 bg: activeFenSource === puzzleId ? 'teal.600' : 'teal.600',
// // // //                                                 color: 'teal.100'
// // // //                                             }
// // // //                                         }}
// // // //                                         onClick={() => handlePuzzleClick(puzzleId)}
// // // //                                         isLoading={isPuzzleLoading && activeFenSource === puzzleId}
// // // //                                         isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}
// // // //                                     >
// // // //                                         {index + 1}
// // // //                                     </Button>
// // // //                                 </WrapItem>
// // // //                             ))}
// // // //                         </Wrap>
// // // //                     </Box>
// // // //                 </Box>

// // // //                 {/* Right Column */}
// // // //                 <Box flex={{ base: "1", md: "1.5" }}>
// // // //                     {currentFen ? (
// // // //                         <ChessGame key={currentFen} initialFen={currentFen} />
// // // //                     ) : (
// // // //                         <Flex height="700px" align="center" justify="center" bg="gray.100" borderRadius="md">
// // // //                             <Text color="gray.500">Select a position to load</Text>
// // // //                         </Flex>
// // // //                     )}
// // // //                 </Box>

// // // //             </Flex>
// // // //         </Box>
// // // //     );
// // // // }

// // // // export default MappingDetails;
// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //     Box, Heading, Text, Spinner, Flex,
// // //     Button, Wrap, WrapItem, useToast
// // // } from '@chakra-ui/react';
// // // import { useParams } from 'react-router-dom';
// // // import axios from 'axios';
// // // import ChessGame from './ChessGame';

// // // function MappingDetails() {
// // //     const { storyId, mappingId } = useParams();
// // //     const [story, setStory] = useState(null);
// // //     const [mapping, setMapping] = useState(null);
// // //     const [principle, setPrinciple] = useState(null);
// // //     const [loading, setLoading] = useState(true);
// // //     const [error, setError] = useState(null);
// // //     const toast = useToast();

// // //     const [originalFen, setOriginalFen] = useState(null);
// // //     const [currentFen, setCurrentFen] = useState(null);
// // //     const [activeFenSource, setActiveFenSource] = useState(null);
// // //     const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);

// // //     const [puzzleSolution, setPuzzleSolution] = useState(null); // NEW STATE for solution

// // //     useEffect(() => {
// // //         setLoading(true);
// // //         setError(null);
// // //         let principleId = null;

// // //         const fetchData = async () => {
// // //             try {
// // //                 const storyRes = await axios.get(`http://localhost:5000/stories/${storyId}`);
// // //                 setStory(storyRes.data);

// // //                 const mappingRes = await axios.get(`http://localhost:5000/story-mappings/${storyId}`);
// // //                 const foundMapping = mappingRes.data.find(m => m.mapping_id.toString() === mappingId.toString());
// // //                 if (!foundMapping) throw new Error("Mapping not found");
// // //                 setMapping(foundMapping);
// // //                 principleId = foundMapping.principle_id;

// // //                 if (principleId) {
// // //                     const principleRes = await axios.get(`http://localhost:5000/principle/${principleId}`);
// // //                     setPrinciple(principleRes.data);
// // //                     if (principleRes.data.fen_with_move) {
// // //                         setOriginalFen(principleRes.data.fen_with_move);
// // //                         setCurrentFen(principleRes.data.fen_with_move);
// // //                         setActiveFenSource('original');
// // //                     }
// // //                 }
// // //             } catch (err) {
// // //                 setError(err.message);
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         };

// // //         fetchData();
// // //     }, [storyId, mappingId]);

// // //     const getCleanedPuzzleArray = (str) => {
// // //         if (!str || typeof str !== 'string') return [];
// // //         return str.trim().replace(/^\[|\]$/g, '').replace(/'/g, '').split(',').map(p => p.trim()).filter(Boolean);
// // //     };

// // //     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

// // //     const handlePuzzleClick = async (puzzleId) => {
// // //         if (activeFenSource === puzzleId) return;
// // //         setIsPuzzleLoading(true);
// // //         setActiveFenSource(puzzleId);

// // //         try {
// // //             const res = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
// // //             if (res.data?.fen_with_move) {
// // //                 setCurrentFen(res.data.fen_with_move);
// // //                 toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000 });
// // //             }

// // //             // Fetch puzzle solution
// // //             const solutionRes = await axios.get(`http://localhost:5000/chess_puzzle/${puzzleId}`);
// // //             if (solutionRes.data?.solution) {
// // //                 setPuzzleSolution(solutionRes.data.solution);
// // //             } else {
// // //                 setPuzzleSolution(null);
// // //             }
// // //         } catch (err) {
// // //             toast({ title: "Error Loading Puzzle", description: err.message, status: 'error', duration: 4000 });
// // //             setPuzzleSolution(null);
// // //         } finally {
// // //             setIsPuzzleLoading(false);
// // //         }
// // //     };

// // //     const handleOriginalFenClick = () => {
// // //         if (activeFenSource === 'original' || !originalFen) return;
// // //         setCurrentFen(originalFen);
// // //         setActiveFenSource('original');
// // //         setPuzzleSolution(null); // Clear solution when original is loaded
// // //         toast({ title: "Loaded Original Position", status: 'info', duration: 2000 });
// // //     };

// // //     if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
// // //     if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

// // //     return (
// // //         <Box px={{ base: 4, md: 10 }} py={8} maxW="100%" mx="auto">
// // //             <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="flex-start">

// // //                 {/* Left Column */}
// // //                 <Box flex={{ base: "1", md: "1.2" }}>
// // //                     <Heading mb={3}>{story.title}</Heading>
// // //                     <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// // //                     {/* Story Message */}
// // //                     <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
// // //                         <Heading size="sm" mb={2} color="blue.700">Story Message</Heading>
// // //                         <Text color="gray.700">{mapping.story_text}</Text>
// // //                     </Box>

// // //                     {/* Principle */}
// // //                     {principle && (
// // //                         <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
// // //                             <Heading size="sm" mb={2} color="blue.700">Principle</Heading>
// // //                             <Text color="gray.700">{principle.principle}</Text>
// // //                         </Box>
// // //                     )}

// // //                     {/* Load Position */}
// // //                     <Box p={4} bg="blue.50" borderRadius="md">
// // //                         <Heading size="xs" mb={3} textTransform="uppercase" color="blue.600">Load Position</Heading>
// // //                         <Wrap spacing={3}>
// // //                             {originalFen && (
// // //                                 <WrapItem>
// // //                                     <Button
// // //                                         size="sm"
// // //                                         bg={activeFenSource === 'original' ? 'teal.500' : 'gray.100'}
// // //                                         color={activeFenSource === 'original' ? 'white' : 'gray.700'}
// // //                                         borderWidth="2px"
// // //                                         borderColor={activeFenSource === 'original' ? 'teal.500' : 'gray.300'}
// // //                                         transition="all 0.2s"
// // //                                         _hover={{
// // //                                             bg: activeFenSource === 'original' ? 'teal.600' : 'teal.100',
// // //                                             color: activeFenSource === 'original' ? 'white' : 'teal.700'
// // //                                         }}
// // //                                         _dark={{
// // //                                             bg: activeFenSource === 'original' ? 'teal.500' : 'gray.700',
// // //                                             color: activeFenSource === 'original' ? 'white' : 'gray.200',
// // //                                             borderColor: activeFenSource === 'original' ? 'teal.500' : 'gray.600',
// // //                                             _hover: {
// // //                                                 bg: activeFenSource === 'original' ? 'teal.600' : 'teal.600',
// // //                                                 color: 'teal.100'
// // //                                             }
// // //                                         }}
// // //                                         onClick={handleOriginalFenClick}
// // //                                         isLoading={isPuzzleLoading && activeFenSource === 'original'}
// // //                                     >
// // //                                         Position
// // //                                     </Button>
// // //                                 </WrapItem>
// // //                             )}
// // //                             {puzzles.map((puzzleId, index) => (
// // //                                 <WrapItem key={index}>
// // //                                     <Button
// // //                                         size="sm"
// // //                                         bg={activeFenSource === puzzleId ? 'teal.500' : 'gray.100'}
// // //                                         color={activeFenSource === puzzleId ? 'white' : 'gray.700'}
// // //                                         borderWidth="2px"
// // //                                         borderColor={activeFenSource === puzzleId ? 'teal.500' : 'gray.300'}
// // //                                         transition="all 0.2s"
// // //                                         _hover={{
// // //                                             bg: activeFenSource === puzzleId ? 'teal.600' : 'teal.100',
// // //                                             color: activeFenSource === puzzleId ? 'white' : 'teal.700'
// // //                                         }}
// // //                                         _dark={{
// // //                                             bg: activeFenSource === puzzleId ? 'teal.500' : 'gray.700',
// // //                                             color: activeFenSource === puzzleId ? 'white' : 'gray.200',
// // //                                             borderColor: activeFenSource === puzzleId ? 'teal.500' : 'gray.600',
// // //                                             _hover: {
// // //                                                 bg: activeFenSource === puzzleId ? 'teal.600' : 'teal.600',
// // //                                                 color: 'teal.100'
// // //                                             }
// // //                                         }}
// // //                                         onClick={() => handlePuzzleClick(puzzleId)}
// // //                                         isLoading={isPuzzleLoading && activeFenSource === puzzleId}
// // //                                         isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}
// // //                                     >
// // //                                         {index + 1}
// // //                                     </Button>
// // //                                 </WrapItem>
// // //                             ))}
// // //                         </Wrap>

// // //                         {/* Puzzle Solution Box */}
// // //                         {puzzleSolution && (
// // //                             <Box p={4} bg="green.50" borderRadius="md" mt={4}>
// // //                                 <Heading size="sm" mb={2} color="green.700">Puzzle Solution</Heading>
// // //                                 <Text color="gray.700">{puzzleSolution}</Text>
// // //                             </Box>
// // //                         )}
// // //                     </Box>
// // //                 </Box>

// // //                 {/* Right Column */}
// // //                 <Box flex={{ base: "1", md: "1.5" }}>
// // //                     {currentFen ? (
// // //                         <ChessGame key={currentFen} initialFen={currentFen} />
// // //                     ) : (
// // //                         <Flex height="700px" align="center" justify="center" bg="gray.100" borderRadius="md">
// // //                             <Text color="gray.500">Select a position to load</Text>
// // //                         </Flex>
// // //                     )}
// // //                 </Box>

// // //             </Flex>
// // //         </Box>
// // //     );
// // // }

// // // export default MappingDetails;
// // import React, { useEffect, useState } from 'react';
// // import {
// //     Box, Heading, Text, Spinner, Flex,
// //     Button, Wrap, WrapItem, useToast, useColorModeValue
// // } from '@chakra-ui/react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import ChessGame from './ChessGame';

// // function MappingDetails() {
// //     const { storyId, mappingId } = useParams();
// //     const [story, setStory] = useState(null);
// //     const [mapping, setMapping] = useState(null);
// //     const [principle, setPrinciple] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const toast = useToast();

// //     const [originalFen, setOriginalFen] = useState(null);
// //     const [currentFen, setCurrentFen] = useState(null);
// //     const [activeFenSource, setActiveFenSource] = useState(null);
// //     const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);
// //     const [answer, setAnswer] = useState('');

// //     useEffect(() => {
// //         setLoading(true);
// //         setError(null);

// //         const fetchData = async () => {
// //             try {
// //                 const storyRes = await axios.get(`http://localhost:5000/stories/${storyId}`);
// //                 setStory(storyRes.data);

// //                 const mappingRes = await axios.get(`http://localhost:5000/story-mappings/${storyId}`);
// //                 const foundMapping = mappingRes.data.find(m => m.mapping_id.toString() === mappingId.toString());
// //                 if (!foundMapping) throw new Error("Mapping not found");
// //                 setMapping(foundMapping);

// //                 const principleId = foundMapping.principle_id;
// //                 if (principleId) {
// //                     const principleRes = await axios.get(`http://localhost:5000/principle/${principleId}`);
// //                     setPrinciple(principleRes.data);
// //                     if (principleRes.data.fen_with_move) {
// //                         setOriginalFen(principleRes.data.fen_with_move);
// //                         setCurrentFen(principleRes.data.fen_with_move);
// //                         setActiveFenSource('original');
// //                     }
// //                 }
// //             } catch (err) {
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, [storyId, mappingId]);

// //     const getCleanedPuzzleArray = (str) => {
// //         if (!str || typeof str !== 'string') return [];
// //         return str.trim().replace(/^\[|\]$/g, '').replace(/'/g, '').split(',').map(p => p.trim()).filter(Boolean);
// //     };

// //     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

// //     const handlePuzzleClick = async (puzzleId) => {
// //         if (activeFenSource === puzzleId) return;

// //         setIsPuzzleLoading(true);
// //         setActiveFenSource(puzzleId);

// //         try {
// //             const fenRes = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
// //             if (fenRes.data?.fen_with_move) {
// //                 setCurrentFen(fenRes.data.fen_with_move);
// //                 toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000 });
// //             }

// //             const answerRes = await axios.get(`http://localhost:5000/puzzle-answer/${puzzleId}`);
// //             setAnswer(answerRes.data.answer || "No answer available.");

// //         } catch (err) {
// //             toast({ title: "Error Loading Puzzle or Answer", description: err.message, status: 'error', duration: 4000 });
// //         } finally {
// //             setIsPuzzleLoading(false);
// //         }
// //     };

// //     const handleOriginalFenClick = () => {
// //         if (activeFenSource === 'original' || !originalFen) return;
// //         setCurrentFen(originalFen);
// //         setActiveFenSource('original');
// //         setAnswer('');
// //         toast({ title: "Loaded Original Position", status: 'info', duration: 2000 });
// //     };

// //     if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
// //     if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

// //     const bgBox = useColorModeValue("blue.50", "blue.900");
// //     const textColor = useColorModeValue("gray.700", "gray.300");

// //     return (
// //         <Box px={{ base: 4, md: 10 }} py={8} maxW="100%" mx="auto">
// //             <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="flex-start">
                
// //                 {/* Left Column */}
// //                 <Box flex={{ base: "1", md: "1.2" }}>
// //                     <Heading mb={3}>{story.title}</Heading>
// //                     <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// //                     <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
// //                         <Heading size="sm" mb={2} color="blue.700">Story Message</Heading>
// //                         <Text color={textColor}>{mapping.story_text}</Text>
// //                     </Box>

// //                     {principle && (
// //                         <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
// //                             <Heading size="sm" mb={2} color="blue.700">Principle</Heading>
// //                             <Text color={textColor}>{principle.principle}</Text>
// //                         </Box>
// //                     )}

// //                     <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
// //                         <Heading size="xs" mb={3} textTransform="uppercase" color="blue.600">Load Position</Heading>
// //                         <Wrap spacing={3}>
// //                             {originalFen && (
// //                                 <WrapItem>
// //                                     <Button
// //                                         size="sm"
// //                                         borderRadius="md"
// //                                         bg={activeFenSource === 'original' ? 'teal.500' : 'gray.100'}
// //                                         color={activeFenSource === 'original' ? 'white' : 'gray.700'}
// //                                         borderWidth="2px"
// //                                         borderColor={activeFenSource === 'original' ? 'teal.500' : 'gray.300'}
// //                                         onClick={handleOriginalFenClick}
// //                                         isLoading={isPuzzleLoading && activeFenSource === 'original'}
// //                                     >
// //                                         Position
// //                                     </Button>
// //                                 </WrapItem>
// //                             )}
// //                             {puzzles.map((puzzleId, index) => (
// //                                 <WrapItem key={index}>
// //                                     <Button
// //                                         size="sm"
// //                                         borderRadius="md"
// //                                         bg={activeFenSource === puzzleId ? 'teal.500' : 'gray.100'}
// //                                         color={activeFenSource === puzzleId ? 'white' : 'gray.700'}
// //                                         borderWidth="2px"
// //                                         borderColor={activeFenSource === puzzleId ? 'teal.500' : 'gray.300'}
// //                                         onClick={() => handlePuzzleClick(puzzleId)}
// //                                         isLoading={isPuzzleLoading && activeFenSource === puzzleId}
// //                                         isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}
// //                                     >
// //                                         {index + 1}
// //                                     </Button>
// //                                 </WrapItem>
// //                             ))}
// //                         </Wrap>
// //                     </Box>

// //                     {answer && (
// //                         <Box p={4} bg="green.50" borderRadius="md" mb={4}>
// //                             <Heading size="sm" mb={2} color="green.700">Puzzle Solution</Heading>
// //                             <Text color="green.800" whiteSpace="pre-wrap">{answer}</Text>
// //                         </Box>
// //                     )}
// //                 </Box>

// //                 {/* Right Column */}
// //                 <Box flex={{ base: "1", md: "1.5" }}>
// //                     {currentFen ? (
// //                         <ChessGame key={currentFen} initialFen={currentFen} />
// //                     ) : (
// //                         <Flex height="700px" align="center" justify="center" bg="gray.100" borderRadius="md">
// //                             <Text color="gray.500">Select a position to load</Text>
// //                         </Flex>
// //                     )}
// //                 </Box>

// //             </Flex>
// //         </Box>
// //     );
// // }

// // export default MappingDetails;
// import React, { useEffect, useState } from 'react';
// import {
//     Box, Heading, Text, Spinner, Flex,
//     Button, Wrap, WrapItem, useToast, useColorModeValue
// } from '@chakra-ui/react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import ChessGame from './ChessGame';

// function MappingDetails() {
//     const { storyId, mappingId } = useParams();
//     const [story, setStory] = useState(null);
//     const [mapping, setMapping] = useState(null);
//     const [principle, setPrinciple] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const toast = useToast();

//     const [originalFen, setOriginalFen] = useState(null);
//     const [currentFen, setCurrentFen] = useState(null);
//     const [activeFenSource, setActiveFenSource] = useState(null);
//     const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);
//     const [answer, setAnswer] = useState('');

//     // ✅ FIX: useColorModeValue -> Must be at the top (NOT below render conditions)
//     const bgBox = useColorModeValue("blue.50", "blue.900");
//     const textColor = useColorModeValue("gray.700", "gray.300");

//     useEffect(() => {
//         setLoading(true);
//         setError(null);

//         const fetchData = async () => {
//             try {
//                 const storyRes = await axios.get(`http://localhost:5000/stories/${storyId}`);
//                 setStory(storyRes.data);

//                 const mappingRes = await axios.get(`http://localhost:5000/story-mappings/${storyId}`);
//                 const foundMapping = mappingRes.data.find(m => m.mapping_id.toString() === mappingId.toString());
//                 if (!foundMapping) throw new Error("Mapping not found");
//                 setMapping(foundMapping);

//                 const principleId = foundMapping.principle_id;
//                 if (principleId) {
//                     const principleRes = await axios.get(`http://localhost:5000/principle/${principleId}`);
//                     setPrinciple(principleRes.data);
//                     if (principleRes.data.fen_with_move) {
//                         setOriginalFen(principleRes.data.fen_with_move);
//                         setCurrentFen(principleRes.data.fen_with_move);
//                         setActiveFenSource('original');
//                     }
//                 }
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [storyId, mappingId]);

//     const getCleanedPuzzleArray = (str) => {
//         if (!str || typeof str !== 'string') return [];
//         return str.trim().replace(/^\[|\]$/g, '').replace(/'/g, '').split(',').map(p => p.trim()).filter(Boolean);
//     };

//     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

//     const handlePuzzleClick = async (puzzleId) => {
//         if (activeFenSource === puzzleId) return;

//         setIsPuzzleLoading(true);
//         setActiveFenSource(puzzleId);

//         try {
//             const fenRes = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
//             if (fenRes.data?.fen_with_move) {
//                 setCurrentFen(fenRes.data.fen_with_move);
//                 toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000 });
//             }

//             const answerRes = await axios.get(`http://localhost:5000/puzzle-answer/${puzzleId}`);
//             setAnswer(answerRes.data.answer || "No answer available.");

//         } catch (err) {
//             toast({ title: "Error Loading Puzzle or Answer", description: err.message, status: 'error', duration: 4000 });
//         } finally {
//             setIsPuzzleLoading(false);
//         }
//     };

//     const handleOriginalFenClick = () => {
//         if (activeFenSource === 'original' || !originalFen) return;
//         setCurrentFen(originalFen);
//         setActiveFenSource('original');
//         setAnswer('');
//         toast({ title: "Loaded Original Position", status: 'info', duration: 2000 });
//     };

//     if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
//     if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

//     return (
//         <Box px={{ base: 4, md: 10 }} py={8} maxW="100%" mx="auto">
//             <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="flex-start">

//                 <Box flex={{ base: "1", md: "1.2" }}>
//                     <Heading mb={3}>{story.title}</Heading>
//                     <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

//                     <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
//                         <Heading size="sm" mb={2} color="blue.700">Story Message</Heading>
//                         <Text color={textColor}>{mapping.story_text}</Text>
//                     </Box>

//                     {principle && (
//                         <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
//                             <Heading size="sm" mb={2} color="blue.700">Principle</Heading>
//                             <Text color={textColor}>{principle.principle}</Text>
//                         </Box>
//                     )}

//                     <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
//                         <Heading size="xs" mb={3} textTransform="uppercase" color="blue.600">Load Position</Heading>
//                         <Wrap spacing={3}>
//                             {originalFen && (
//                                 <WrapItem>
//                                     <Button
//                                         size="sm"
//                                         borderRadius="md"
//                                         bg={activeFenSource === 'original' ? 'teal.500' : 'gray.100'}
//                                         color={activeFenSource === 'original' ? 'white' : 'gray.700'}
//                                         borderWidth="2px"
//                                         borderColor={activeFenSource === 'original' ? 'teal.500' : 'gray.300'}
//                                         onClick={handleOriginalFenClick}
//                                         isLoading={isPuzzleLoading && activeFenSource === 'original'}
//                                     >
//                                         Position
//                                     </Button>
//                                 </WrapItem>
//                             )}
//                             {puzzles.map((puzzleId, index) => (
//                                 <WrapItem key={index}>
//                                     <Button
//                                         size="sm"
//                                         borderRadius="md"
//                                         bg={activeFenSource === puzzleId ? 'teal.500' : 'gray.100'}
//                                         color={activeFenSource === puzzleId ? 'white' : 'gray.700'}
//                                         borderWidth="2px"
//                                         borderColor={activeFenSource === puzzleId ? 'teal.500' : 'gray.300'}
//                                         onClick={() => handlePuzzleClick(puzzleId)}
//                                         isLoading={isPuzzleLoading && activeFenSource === puzzleId}
//                                         isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}
//                                     >
//                                         {index + 1}
//                                     </Button>
//                                 </WrapItem>
//                             ))}
//                         </Wrap>
//                     </Box>

//                     {answer && (
//                         <Box p={4} bg="green.50" borderRadius="md" mb={4}>
//                             <Heading size="sm" mb={2} color="green.700">Puzzle Solution</Heading>
//                             <Text color="green.800" whiteSpace="pre-wrap">{answer}</Text>
//                         </Box>
//                     )}
//                 </Box>

//                 <Box flex={{ base: "1", md: "1.5" }}>
//                     {currentFen ? (
//                         <ChessGame key={currentFen} initialFen={currentFen} />
//                     ) : (
//                         <Flex height="700px" align="center" justify="center" bg="gray.100" borderRadius="md">
//                             <Text color="gray.500">Select a position to load</Text>
//                         </Flex>
//                     )}
//                 </Box>
//             </Flex>
//         </Box>
//     );
// }

// export default MappingDetails;

import React, { useEffect, useState } from 'react';
import {
    Box, Heading, Text, Spinner, Flex,
    Button, Wrap, WrapItem, useToast, useColorModeValue
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChessGame from './ChessGame';

function MappingDetails() {
    const { storyId, mappingId } = useParams();
    const [story, setStory] = useState(null);
    const [mapping, setMapping] = useState(null);
    const [principle, setPrinciple] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const [originalFen, setOriginalFen] = useState(null);
    const [currentFen, setCurrentFen] = useState(null);
    const [activeFenSource, setActiveFenSource] = useState(null);
    const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [showSolution, setShowSolution] = useState(false); // 🔥 NEW STATE

    const bgBox = useColorModeValue("blue.50", "blue.900");
    const textColor = useColorModeValue("gray.700", "gray.300");

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const storyRes = await axios.get(`http://localhost:5000/stories/${storyId}`);
                setStory(storyRes.data);

                const mappingRes = await axios.get(`http://localhost:5000/story-mappings/${storyId}`);
                const foundMapping = mappingRes.data.find(m => m.mapping_id.toString() === mappingId.toString());
                if (!foundMapping) throw new Error("Mapping not found");
                setMapping(foundMapping);

                const principleId = foundMapping.principle_id;
                if (principleId) {
                    const principleRes = await axios.get(`http://localhost:5000/principle/${principleId}`);
                    setPrinciple(principleRes.data);
                    if (principleRes.data.fen_with_move) {
                        setOriginalFen(principleRes.data.fen_with_move);
                        setCurrentFen(principleRes.data.fen_with_move);
                        setActiveFenSource('original');
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [storyId, mappingId]);

    const getCleanedPuzzleArray = (str) => {
        if (!str || typeof str !== 'string') return [];
        return str.trim().replace(/^\[|\]$/g, '').replace(/'/g, '').split(',').map(p => p.trim()).filter(Boolean);
    };

    const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

    const handlePuzzleClick = async (puzzleId) => {
        if (activeFenSource === puzzleId) return;

        setIsPuzzleLoading(true);
        setActiveFenSource(puzzleId);
        setShowSolution(false); // 🔥 Reset solution visibility on new puzzle

        try {
            const fenRes = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
            if (fenRes.data?.fen_with_move) {
                setCurrentFen(fenRes.data.fen_with_move);
                toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000 });
            }

            const answerRes = await axios.get(`http://localhost:5000/puzzle-answer/${puzzleId}`);
            setAnswer(answerRes.data.answer || "No answer available.");

        } catch (err) {
            toast({ title: "Error Loading Puzzle or Answer", description: err.message, status: 'error', duration: 4000 });
        } finally {
            setIsPuzzleLoading(false);
        }
    };

    const handleOriginalFenClick = () => {
        if (activeFenSource === 'original' || !originalFen) return;
        setCurrentFen(originalFen);
        setActiveFenSource('original');
        setAnswer('');
        setShowSolution(false);
        toast({ title: "Loaded Original Position", status: 'info', duration: 2000 });
    };

    if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
    if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

    return (
        <Box px={{ base: 4, md: 10 }} py={8} maxW="100%" mx="auto">
            <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="flex-start">

                <Box flex={{ base: "1", md: "1.2" }}>
                    <Heading mb={3}>{story.title}</Heading>
                    <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

                    <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
                        <Heading size="sm" mb={2} color="blue.700">Story Message</Heading>
                        <Text color={textColor}>{mapping.story_text}</Text>
                    </Box>

                    {principle && (
                        <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
                            <Heading size="sm" mb={2} color="blue.700">Principle</Heading>
                            <Text color={textColor}>{principle.principle}</Text>
                        </Box>
                    )}

                    <Box p={4} bg={bgBox} borderRadius="md" mb={6}>
                        <Heading size="xs" mb={3} textTransform="uppercase" color="blue.600">Load Position</Heading>
                        <Wrap spacing={3}>
                            {originalFen && (
                                <WrapItem>
                                    <Button
                                        size="sm"
                                        borderRadius="md"
                                        bg={activeFenSource === 'original' ? 'teal.500' : 'gray.100'}
                                        color={activeFenSource === 'original' ? 'white' : 'gray.700'}
                                        borderWidth="2px"
                                        borderColor={activeFenSource === 'original' ? 'teal.500' : 'gray.300'}
                                        onClick={handleOriginalFenClick}
                                        isLoading={isPuzzleLoading && activeFenSource === 'original'}
                                    >
                                        Position
                                    </Button>
                                </WrapItem>
                            )}
                            {puzzles.map((puzzleId, index) => (
                                <WrapItem key={index}>
                                    <Button
                                        size="sm"
                                        borderRadius="md"
                                        bg={activeFenSource === puzzleId ? 'teal.500' : 'gray.100'}
                                        color={activeFenSource === puzzleId ? 'white' : 'gray.700'}
                                        borderWidth="2px"
                                        borderColor={activeFenSource === puzzleId ? 'teal.500' : 'gray.300'}
                                        onClick={() => handlePuzzleClick(puzzleId)}
                                        isLoading={isPuzzleLoading && activeFenSource === puzzleId}
                                        isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}
                                    >
                                        {index + 1}
                                    </Button>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>

                    {answer && (
                        <Box p={4} bg="green.50" borderRadius="md" mb={4}>
                            <Heading size="sm" mb={3} color="green.700">Puzzle Solution</Heading>

                            {!showSolution ? (
                                <Button size="sm" colorScheme="teal" onClick={() => setShowSolution(true)}>
                                    Show Solution
                                </Button>
                            ) : (
                                <Text mt={3} color="green.800" whiteSpace="pre-wrap">{answer}</Text>
                            )}
                        </Box>
                    )}
                </Box>

                <Box flex={{ base: "1", md: "1.5" }}>
                    {currentFen ? (
                        <ChessGame key={currentFen} initialFen={currentFen} />
                    ) : (
                        <Flex height="700px" align="center" justify="center" bg="gray.100" borderRadius="md">
                            <Text color="gray.500">Select a position to load</Text>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}

export default MappingDetails;

