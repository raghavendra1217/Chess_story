// // // // import React, { useEffect, useState } from 'react';
// // // // import { Box, Heading, Text, Spinner, Flex, Image } from '@chakra-ui/react';
// // // // import { useParams } from 'react-router-dom';
// // // // import axios from 'axios';
// // // // import ChessGame from './ChessGame';

// // // // function MappingDetails() {
// // // //   const { storyId, mappingId } = useParams();
// // // //   const [story, setStory] = useState(null);
// // // //   const [mapping, setMapping] = useState(null);
// // // //   const [principle, setPrinciple] = useState(null);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     axios.get(`http://localhost:5000/stories/${storyId}`)
// // // //       .then(response => {
// // // //         setStory(response.data);
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('Error fetching story info:', error);
// // // //       });

// // // //     axios.get(`http://localhost:5000/story-mappings/${storyId}`)
// // // //       .then(response => {
// // // //         const foundMapping = response.data.find(m => m.mapping_id === mappingId);
// // // //         setMapping(foundMapping);
// // // //         setLoading(false);

// // // //         if (foundMapping?.principle_id) {
// // // //           axios.get(`http://localhost:5000/principle/${foundMapping.principle_id}`)
// // // //             .then(principleRes => {
// // // //               setPrinciple(principleRes.data);
// // // //             })
// // // //             .catch(error => {
// // // //               console.error('Error fetching principle info:', error);
// // // //             });
// // // //         }
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('Error fetching mapping info:', error);
// // // //       });
// // // //   }, [storyId, mappingId]);

// // // //   if (loading || !story || !mapping) {
// // // //     return (
// // // //       <Box p={8}>
// // // //         <Spinner size="xl" />
// // // //       </Box>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <Box p={8}>
// // // //       {/* Story Title and Description */}
// // // //       <Heading mb={2}>{story.title}</Heading>
// // // //       <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// // // //       <Flex gap={8} align="flex-start">
// // // //         {/* LEFT SIDE - Mapping Message and Principle */}
// // // //         <Box flex="1">
// // // //           <Heading size="md" mb={4}>Mapping Message</Heading>

// // // //           <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" mb={6}>
// // // //             <Text color="gray.800">{mapping.story_text}</Text>
// // // //           </Box>

// // // //           {/* Principle Section */}
// // // //           {principle && (
// // // //             <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.100">
// // // //               <Heading size="sm" mb={2}>Principle</Heading>

// // // //               {/* Show only principle text */}
// // // //               <Text mt={1}>{principle.principle}</Text>

// // // //               {/* Small Story Image */}
// // // //               <Box mt={4}>
// // // //                 <Image 
// // // //                   src={`/story_images/${storyId}.png`} 
// // // //                   alt={storyId} 
// // // //                   borderRadius="md" 
// // // //                   objectFit="cover"
// // // //                   width="200px"
// // // //                   height="200px"
// // // //                   fallbackSrc="https://via.placeholder.com/200x200?text=No+Image" 
// // // //                 />
// // // //               </Box>
// // // //             </Box>
// // // //           )}
// // // //         </Box>

// // // //         {/* RIGHT SIDE - Big Chess Board */}
// // // //         <Box flex="1" maxW="50%" height="600px">
// // // //           {principle?.fen_with_move && (
// // // //             <ChessGame initialFen={principle.fen_with_move} />
// // // //           )}
// // // //         </Box>
// // // //       </Flex>
// // // //     </Box>
// // // //   );
// // // // }

// // // // export default MappingDetails;

// // // import React, { useEffect, useState } from 'react';
// // // import { Box, Heading, Text, Spinner, Flex, Image, UnorderedList, ListItem } from '@chakra-ui/react'; // Added UnorderedList, ListItem
// // // import { useParams } from 'react-router-dom';
// // // import axios from 'axios';
// // // import ChessGame from './ChessGame'; // Assuming ChessGame component is in the same directory or correctly imported

// // // function MappingDetails() {
// // //   const { storyId, mappingId } = useParams();
// // //   const [story, setStory] = useState(null);
// // //   const [mapping, setMapping] = useState(null);
// // //   const [principle, setPrinciple] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null); // Added error state

// // //   useEffect(() => {
// // //     setLoading(true); // Set loading true at the start of fetching
// // //     setError(null); // Reset error state
// // //     let principleIdToFetch = null; // Variable to hold principle_id

// // //     // Fetch Story Info
// // //     const storyRequest = axios.get(`http://localhost:5000/stories/${storyId}`)
// // //       .then(response => {
// // //         if (!response.data) throw new Error("Story not found");
// // //         setStory(response.data);
// // //       })
// // //       .catch(error => {
// // //         console.error('Error fetching story info:', error);
// // //         setError(prev => prev ? `${prev}\nError fetching story.` : "Error fetching story.");
// // //       });

// // //     // Fetch Mapping Info
// // //     const mappingRequest = axios.get(`http://localhost:5000/story-mappings/${storyId}`)
// // //       .then(response => {
// // //         const foundMapping = response.data.find(m => m.mapping_id.toString() === mappingId.toString()); // Ensure type comparison is safe
// // //         if (!foundMapping) throw new Error("Mapping not found for this story");
// // //         setMapping(foundMapping);
// // //         principleIdToFetch = foundMapping.principle_id; // Get principle_id from mapping
// // //       })
// // //       .catch(error => {
// // //         console.error('Error fetching mapping info:', error);
// // //          setError(prev => prev ? `${prev}\nError fetching mapping.` : "Error fetching mapping.");
// // //       });

// // //     // Use Promise.all to wait for both story and mapping before potentially fetching principle
// // //     Promise.all([storyRequest, mappingRequest])
// // //       .then(() => {
// // //         // Only fetch principle if we found a mapping with an ID
// // //         if (principleIdToFetch) {
// // //           return axios.get(`http://localhost:5000/principle/${principleIdToFetch}`)
// // //             .then(principleRes => {
// // //               if (!principleRes.data) throw new Error("Principle details not found");
// // //               setPrinciple(principleRes.data);
// // //             })
// // //             .catch(error => {
// // //               console.error('Error fetching principle info:', error);
// // //               setError(prev => prev ? `${prev}\nError fetching principle.` : "Error fetching principle.");
// // //             });
// // //         }
// // //         // Resolve immediately if no principle ID to fetch
// // //         return Promise.resolve();
// // //       })
// // //       .catch((err) => {
// // //          // Catch errors from Promise.all itself or potential rejections above
// // //          console.error("Error during combined fetch:", err);
// // //          // Error state might have been set already in individual catches
// // //          if (!error) setError("An error occurred fetching details.");
// // //       })
// // //       .finally(() => {
// // //         setLoading(false); // Set loading false after all fetches are done or failed
// // //       });

// // //   }, [storyId, mappingId, error]); // Added 'error' to dependency array to avoid potential issues, though might not be strictly needed

// // //   // --- Helper to parse and clean the puzzle list ---
// // //   const getPuzzleArray = (puzzleListString) => {
// // //     if (!puzzleListString || typeof puzzleListString !== 'string') {
// // //       return [];
// // //     }
// // //     return puzzleListString
// // //       .split(',')                // Split by comma
// // //       .map(item => item.trim()) // Remove whitespace around each item
// // //       .filter(Boolean);          // Remove any empty strings resulting from split
// // //   };

// // //   const puzzles = principle ? getPuzzleArray(principle.puzzle_list) : [];

// // //   // --- Render Logic ---

// // //   if (loading) {
// // //     return (
// // //       <Box p={8} textAlign="center">
// // //         <Spinner size="xl" />
// // //         <Text mt={4}>Loading details...</Text>
// // //       </Box>
// // //     );
// // //   }

// // //   if (error) {
// // //      return (
// // //       <Box p={8} textAlign="center" color="red.500">
// // //         <Heading size="md" mb={4}>Error Loading Data</Heading>
// // //         {/* Display specific errors if needed, split by newline */}
// // //         {error.split('\n').map((line, index) => <Text key={index}>{line}</Text>)}
// // //         <Text mt={4}>Please check the console or try again later.</Text>
// // //       </Box>
// // //      )
// // //   }

// // //   if (!story || !mapping) {
// // //      // This case might be covered by the error state now, but good as a fallback
// // //     return (
// // //       <Box p={8} textAlign="center">
// // //         <Heading size="md">Details Not Found</Heading>
// // //         <Text>Could not find the requested story or mapping.</Text>
// // //       </Box>
// // //     );
// // //   }


// // //   return (
// // //     <Box p={8}>
// // //       {/* Story Title and Description */}
// // //       <Heading mb={2}>{story.title}</Heading>
// // //       <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// // //       <Flex gap={8} align="flex-start" direction={{ base: 'column', md: 'row' }}> {/* Responsive direction */}
// // //         {/* LEFT SIDE - Mapping Message and Principle */}
// // //         <Box flex="1" w="full"> {/* Ensure Box takes full width on smaller screens */}
// // //           <Heading size="md" mb={4}>Mapping Message</Heading>

// // //           <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" mb={6}>
// // //             <Text color="gray.800">{mapping.story_text}</Text>
// // //           </Box>

// // //           {/* Principle Section - Conditionally render only if principle exists */}
// // //           {principle ? (
// // //             <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.100">
// // //               <Heading size="sm" mb={2}>Principle</Heading>
// // //               <Text mt={1} mb={4}>{principle.principle}</Text> {/* Added bottom margin */}

// // //               {/* Puzzle List Section */}
// // //               {puzzles.length > 0 && ( // Only show if puzzles exist
// // //                 <Box mb={4}> {/* Add margin below the list */}
// // //                   <Heading size="xs" mb={2} textTransform="uppercase" color="gray.600">
// // //                     Related Puzzles
// // //                   </Heading>
// // //                   <UnorderedList spacing={1} pl={4}> {/* Add some padding/indentation */}
// // //                     {puzzles.map((puzzleId, index) => (
// // //                       <ListItem key={`${puzzleId}-${index}`} fontSize="sm"> {/* Added fontSize */}
// // //                         {puzzleId}
// // //                       </ListItem>
// // //                     ))}
// // //                   </UnorderedList>
// // //                 </Box>
// // //               )}

// // //               {/* Small Story Image */}
// // //               <Box mt={4}>
// // //                 <Image
// // //                   src={`/story_images/${storyId}.png`}
// // //                   alt={`Image for story ${storyId}`} 
// // //                   borderRadius="md"
// // //                   objectFit="cover"
// // //                   boxSize="150px" // Use boxSize for square images
// // //                   fallbackSrc="https://via.placeholder.com/150?text=No+Image" // Adjust placeholder size
// // //                 />
// // //               </Box>
// // //             </Box>
// // //           ) : (
// // //             // Optional: Show a message if the principle couldn't be loaded but mapping exists
// // //              <Text color="gray.500" fontStyle="italic">Principle details not available.</Text>
// // //           )}
// // //         </Box>

// // //         {/* RIGHT SIDE - Big Chess Board */}
// // //         {/* Use minW to prevent excessive shrinking, adjust maxW if needed */}
// // //         <Box flex="1" w="full" minW={{ md: "420px" }} maxW={{ md: "50%" }} /* height="auto" */ > {/* Let height be auto */}
// // //           {principle?.fen_with_move ? (
// // //             <ChessGame initialFen={principle.fen_with_move} />
// // //           ) : (
// // //              // Optional: Placeholder if FEN is missing but principle exists
// // //              principle && <Text color="gray.500" fontStyle="italic">Chess position not available for this principle.</Text>
// // //           )}
// // //         </Box>
// // //       </Flex>
// // //     </Box>
// // //   );
// // // }

// // // export default MappingDetails;
// // import React, { useEffect, useState } from 'react';
// // import {
// //     Box, Heading, Text, Spinner, Flex, Image,
// //     Button, // Import Button
// //     Wrap, WrapItem // Import Wrap for button layout
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

// //     useEffect(() => {
// //         setLoading(true);
// //         setError(null);
// //         let principleIdToFetch = null;

// //         const storyRequest = axios.get(`http://localhost:5000/stories/${storyId}`)
// //             .then(response => {
// //                 if (!response.data) throw new Error("Story not found");
// //                 setStory(response.data);
// //             })
// //             .catch(error => {
// //                 console.error('Error fetching story info:', error);
// //                 setError(prev => prev ? `${prev}\nError fetching story.` : "Error fetching story.");
// //             });

// //         const mappingRequest = axios.get(`http://localhost:5000/story-mappings/${storyId}`)
// //             .then(response => {
// //                 const foundMapping = response.data.find(m => m.mapping_id.toString() === mappingId.toString());
// //                 if (!foundMapping) throw new Error("Mapping not found for this story");
// //                 setMapping(foundMapping);
// //                 principleIdToFetch = foundMapping.principle_id;
// //             })
// //             .catch(error => {
// //                 console.error('Error fetching mapping info:', error);
// //                 setError(prev => prev ? `${prev}\nError fetching mapping.` : "Error fetching mapping.");
// //             });

// //         Promise.all([storyRequest, mappingRequest])
// //             .then(() => {
// //                 if (principleIdToFetch) {
// //                     return axios.get(`http://localhost:5000/principle/${principleIdToFetch}`)
// //                         .then(principleRes => {
// //                             if (!principleRes.data) throw new Error("Principle details not found");
// //                             setPrinciple(principleRes.data);
// //                         })
// //                         .catch(error => {
// //                             console.error('Error fetching principle info:', error);
// //                             setError(prev => prev ? `${prev}\nError fetching principle.` : "Error fetching principle.");
// //                         });
// //                 }
// //                 return Promise.resolve();
// //             })
// //             .catch((err) => {
// //                 console.error("Error during combined fetch:", err);
// //                 if (!error) setError("An error occurred fetching details.");
// //             })
// //             .finally(() => {
// //                 setLoading(false);
// //             });

// //     }, [storyId, mappingId, error]); // Included error dependency

// //     // --- Helper to parse and CLEAN the puzzle list string ---
// //     const getCleanedPuzzleArray = (puzzleListString) => {
// //         if (!puzzleListString || typeof puzzleListString !== 'string') {
// //             return [];
// //         }

// //         let cleanedString = puzzleListString.trim();

// //         // 1. Remove brackets if they exist at start/end
// //         if (cleanedString.startsWith('[') && cleanedString.endsWith(']')) {
// //             cleanedString = cleanedString.slice(1, -1);
// //         }

// //         // 2. Remove all single quotes globally
// //         cleanedString = cleanedString.replace(/'/g, '');

// //         // 3. Split by comma, trim whitespace for each item, and filter out empty strings
// //         return cleanedString
// //             .split(',')
// //             .map(item => item.trim()) // Trim whitespace from each potential ID
// //             .filter(Boolean);         // Remove any empty strings resulted from extra commas etc.
// //     };

// //     // Get the cleaned array of puzzle IDs
// //     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

// //     // --- Render Logic ---

// //     if (loading) {
// //         return (
// //             <Box p={8} textAlign="center">
// //                 <Spinner size="xl" />
// //                 <Text mt={4}>Loading details...</Text>
// //             </Box>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <Box p={8} textAlign="center" color="red.500">
// //                 <Heading size="md" mb={4}>Error Loading Data</Heading>
// //                 {error.split('\n').map((line, index) => <Text key={index}>{line}</Text>)}
// //                 <Text mt={4}>Please check the console or try again later.</Text>
// //             </Box>
// //         )
// //     }

// //     if (!story || !mapping) {
// //         return (
// //             <Box p={8} textAlign="center">
// //                 <Heading size="md">Details Not Found</Heading>
// //                 <Text>Could not find the requested story or mapping.</Text>
// //             </Box>
// //         );
// //     }


// //     return (
// //         <Box p={8}>
// //             {/* Story Title and Description */}
// //             <Heading mb={2}>{story.title}</Heading>
// //             <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

// //             <Flex gap={8} align="flex-start" direction={{ base: 'column', md: 'row' }}>
// //                 {/* LEFT SIDE - Mapping Message and Principle */}
// //                 <Box flex="1" w="full">
// //                     <Heading size="md" mb={4}>Mapping Message</Heading>

// //                     <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" mb={6}>
// //                         <Text color="gray.800">{mapping.story_text}</Text>
// //                     </Box>

// //                     {/* Principle Section */}
// //                     {principle ? (
// //                         <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.100">
// //                             <Heading size="sm" mb={2}>Principle</Heading>
// //                             <Text mt={1} mb={4}>{principle.principle}</Text>

// //                             {/* Puzzle List Section - Display as Buttons */}
// //                             {puzzles.length > 0 && (
// //                                 <Box mb={4}>
// //                                     <Heading size="xs" mb={3} textTransform="uppercase" color="gray.600">
// //                                         Related Puzzles
// //                                     </Heading>
// //                                     {/* Use Wrap for button layout */}
// //                                     <Wrap spacing="10px">
// //                                         {puzzles.map((puzzleId, index) => (
// //                                             <WrapItem key={`${puzzleId}-${index}`}>
// //                                                 <Button
// //                                                     size="sm"
// //                                                     colorScheme="teal" // Or any other color scheme
// //                                                     variant="outline"
// //                                                     onClick={() => {
// //                                                         // Add functionality here if needed, e.g., navigate or fetch puzzle details
// //                                                         console.log("Clicked Puzzle:", puzzleId);
// //                                                     }}
// //                                                 >
// //                                                     {puzzleId}
// //                                                 </Button>
// //                                             </WrapItem>
// //                                         ))}
// //                                     </Wrap>
// //                                 </Box>
// //                             )}

// //                             {/* Small Story Image */}
// //                             <Box mt={4}>
// //                                 <Image
// //                                     src={`/story_images/${storyId}.png`}
// //                                     alt={`Image for story ${storyId}`}
// //                                     borderRadius="md"
// //                                     objectFit="cover"
// //                                     boxSize="150px"
// //                                     fallbackSrc="https://via.placeholder.com/150?text=No+Image"
// //                                 />
// //                             </Box>
// //                         </Box>
// //                     ) : (
// //                         <Text color="gray.500" fontStyle="italic">Principle details not available.</Text>
// //                     )}
// //                 </Box>

// //                 {/* RIGHT SIDE - Big Chess Board */}
// //                 <Box flex="1" w="full" minW={{ md: "420px" }} maxW={{ md: "50%" }} >
// //                     {principle?.fen_with_move ? (
// //                         <ChessGame initialFen={principle.fen_with_move} />
// //                     ) : (
// //                         principle && <Text color="gray.500" fontStyle="italic">Chess position not available for this principle.</Text>
// //                     )}
// //                 </Box>
// //             </Flex>
// //         </Box>
// //     );
// // }

// // export default MappingDetails;

// import React, { useEffect, useState } from 'react';
// import {
//     Box, Heading, Text, Spinner, Flex, Image,
//     Button,
//     Wrap, WrapItem, useToast // Import useToast for feedback
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
//     const toast = useToast(); // Initialize toast

//     // --- State for Chessboard ---
//     const [originalFen, setOriginalFen] = useState(null); // Store the initial principle FEN
//     const [currentFen, setCurrentFen] = useState(null); // FEN currently displayed
//     const [activeFenSource, setActiveFenSource] = useState(null); // 'original' or puzzleId
//     const [isPuzzleLoading, setIsPuzzleLoading] = useState(false); // Loading state for puzzle FEN fetch

//     useEffect(() => {
//         setLoading(true);
//         setError(null);
//         setOriginalFen(null); // Reset FENs on new load
//         setCurrentFen(null);
//         setActiveFenSource(null);
//         let principleIdToFetch = null;

//         const storyRequest = axios.get(`http://localhost:5000/stories/${storyId}`)
//             .then(response => {
//                 if (!response.data) throw new Error("Story not found");
//                 setStory(response.data);
//             }).catch(error => {
//                 console.error('Error fetching story info:', error);
//                 setError(prev => prev ? `${prev}\nError fetching story.` : "Error fetching story.");
//             });

//         const mappingRequest = axios.get(`http://localhost:5000/story-mappings/${storyId}`)
//             .then(response => {
//                 const foundMapping = response.data.find(m => m.mapping_id.toString() === mappingId.toString());
//                 if (!foundMapping) throw new Error("Mapping not found for this story");
//                 setMapping(foundMapping);
//                 principleIdToFetch = foundMapping.principle_id;
//             }).catch(error => {
//                 console.error('Error fetching mapping info:', error);
//                 setError(prev => prev ? `${prev}\nError fetching mapping.` : "Error fetching mapping.");
//             });

//         Promise.all([storyRequest, mappingRequest])
//             .then(() => {
//                 if (principleIdToFetch) {
//                     return axios.get(`http://localhost:5000/principle/${principleIdToFetch}`)
//                         .then(principleRes => {
//                             if (!principleRes.data) throw new Error("Principle details not found");
//                             setPrinciple(principleRes.data);
//                             // **** Store original FEN and set current FEN initially ****
//                             if (principleRes.data.fen_with_move) {
//                                 setOriginalFen(principleRes.data.fen_with_move);
//                                 setCurrentFen(principleRes.data.fen_with_move);
//                                 setActiveFenSource('original'); // Mark original as active by default
//                             } else {
//                                  console.warn("Principle loaded but fen_with_move is missing.");
//                                  // Optionally set an error or keep currentFen null
//                             }
//                         })
//                         .catch(error => {
//                             console.error('Error fetching principle info:', error);
//                             setError(prev => prev ? `${prev}\nError fetching principle.` : "Error fetching principle.");
//                         });
//                 }
//                 return Promise.resolve();
//             })
//             .catch((err) => {
//                 console.error("Error during combined fetch:", err);
//                 if (!error) setError("An error occurred fetching details.");
//             })
//             .finally(() => {
//                 setLoading(false);
//             });

//     }, [storyId, mappingId]); // Removed 'error' dependency, fetch runs once on mount/param change


//     // --- Helper to parse and CLEAN the puzzle list string ---
//     const getCleanedPuzzleArray = (puzzleListString) => {
//         // ... (cleaning logic remains the same as previous version)
//         if (!puzzleListString || typeof puzzleListString !== 'string') return [];
//         let cleanedString = puzzleListString.trim();
//         if (cleanedString.startsWith('[') && cleanedString.endsWith(']')) {
//             cleanedString = cleanedString.slice(1, -1);
//         }
//         cleanedString = cleanedString.replace(/'/g, '');
//         return cleanedString.split(',').map(item => item.trim()).filter(Boolean);
//     };

//     const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

//     // --- Function to handle Puzzle Button Click ---
//     const handlePuzzleClick = async (puzzleId) => {
//         if (activeFenSource === puzzleId) return; // Already selected

//         setIsPuzzleLoading(true); // Indicate loading
//         setActiveFenSource(puzzleId); // Optimistically set active source for styling

//         try {
//             console.log(`Fetching puzzle: ${puzzleId}`); // Debug log
//             const response = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
//             if (response.data && response.data.fen_with_move) {
//                 console.log(`Setting FEN for ${puzzleId}:`, response.data.fen_with_move); // Debug log
//                 setCurrentFen(response.data.fen_with_move);
//                 toast({
//                     title: `Loaded Puzzle ${puzzleId}`,
//                     status: 'success',
//                     duration: 2000,
//                     isClosable: true,
//                 });
//             } else {
//                 throw new Error(`Puzzle ${puzzleId} loaded but missing 'fen_with_move'.`);
//             }
//         } catch (err) {
//             console.error(`Error fetching FEN for puzzle ${puzzleId}:`, err);
//             toast({
//                 title: 'Error Loading Puzzle',
//                 description: `Could not load position for ${puzzleId}. ${err.response?.data || err.message}`,
//                 status: 'error',
//                 duration: 5000,
//                 isClosable: true,
//             });
//             // Revert active source if fetch failed? Optional, maybe keep it highlighted
//             // setActiveFenSource(currentFen === originalFen ? 'original' : activeFenSource); // Revert logic might be complex
//         } finally {
//             setIsPuzzleLoading(false);
//         }
//     };

//     // --- Function to handle Original FEN Button Click ---
//     const handleOriginalFenClick = () => {
//         if (activeFenSource === 'original' || !originalFen) return; // Already selected or no original FEN

//         console.log("Loading original principle FEN:", originalFen);
//         setCurrentFen(originalFen);
//         setActiveFenSource('original');
//         toast({
//             title: 'Loaded Original Position',
//             status: 'info',
//             duration: 2000,
//             isClosable: true,
//         });
//     };


//     // --- Render Logic ---

//     if (loading) { /* ... Loading spinner ... */
//         return ( <Box p={8} textAlign="center"> <Spinner size="xl" /> <Text mt={4}>Loading details...</Text> </Box> );
//     }
//     if (error) { /* ... Error display ... */
//         return ( <Box p={8} textAlign="center" color="red.500"> <Heading size="md" mb={4}>Error Loading Data</Heading> {error.split('\n').map((line, index) => <Text key={index}>{line}</Text>)} <Text mt={4}>Please check the console or try again later.</Text> </Box> );
//     }
//     if (!story || !mapping) { /* ... Not found display ... */
//         return ( <Box p={8} textAlign="center"> <Heading size="md">Details Not Found</Heading> <Text>Could not find the requested story or mapping.</Text> </Box> );
//     }

//     return (
//         <Box p={8}>
//             {/* Story Title and Description */}
//             <Heading mb={2}>{story.title}</Heading>
//             <Text fontSize="lg" color="gray.500" mb={6}>{story.description}</Text>

//             <Flex gap={8} align="flex-start" direction={{ base: 'column', md: 'row' }}>
//                 {/* LEFT SIDE - Mapping Message and Principle */}
//                 <Box flex="1" w="full">
//                     <Heading size="md" mb={4}>Mapping Message</Heading>
//                     <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" mb={6}>
//                         <Text color="gray.800">{mapping.story_text}</Text>
//                     </Box>

//                     {/* Principle Section */}
//                     {principle ? (
//                         <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.100">
//                             <Heading size="sm" mb={2}>Principle</Heading>
//                             <Text mt={1} mb={4}>{principle.principle}</Text>

//                             {/* Buttons to select FEN (Original + Puzzles) */}
//                             <Box mb={4}>
//                                 <Heading size="xs" mb={3} textTransform="uppercase" color="gray.600">
//                                     Load Position
//                                 </Heading>
//                                 <Wrap spacing="10px" align="center">
//                                     {/* Original FEN Button */}
//                                     {originalFen && ( // Only show if original FEN exists
//                                         <WrapItem>
//                                             <Button
//                                                 size="sm"
//                                                 colorScheme="blue" // Different color for distinction
//                                                 variant={activeFenSource === 'original' ? 'solid' : 'outline'} // Style based on selection
//                                                 onClick={handleOriginalFenClick}
//                                                 isDisabled={activeFenSource === 'original'} // Disable if already selected
//                                                 isLoading={isPuzzleLoading && activeFenSource === 'original'} // Show spinner if trying to load this while puzzle loads
//                                             >
//                                                 Original Position
//                                             </Button>
//                                         </WrapItem>
//                                     )}

//                                     {/* Puzzle Buttons */}
//                                     {puzzles.map((puzzleId, index) => (
//                                         <WrapItem key={`${puzzleId}-${index}`}>
//                                             <Button
//                                                 size="sm"
//                                                 colorScheme="teal"
//                                                 variant={activeFenSource === puzzleId ? 'solid' : 'outline'} // Style based on selection
//                                                 onClick={() => handlePuzzleClick(puzzleId)}
//                                                 isLoading={isPuzzleLoading && activeFenSource === puzzleId} // Show spinner on clicked button
//                                                 isDisabled={isPuzzleLoading && activeFenSource !== puzzleId} // Disable others while one loads
//                                             >
//                                                 {puzzleId}
//                                             </Button>
//                                         </WrapItem>
//                                     ))}
//                                 </Wrap>
//                             </Box>

//                             {/* Small Story Image */}
//                             <Box mt={4}>
//                                 <Image
//                                     src={`/story_images/${storyId}.png`}
//                                     alt={`Image for story ${storyId}`}
//                                     borderRadius="md" objectFit="cover" boxSize="150px"
//                                     fallbackSrc="https://via.placeholder.com/150?text=No+Image"
//                                 />
//                             </Box>
//                         </Box>
//                     ) : (
//                         <Text color="gray.500" fontStyle="italic">Principle details not available.</Text>
//                     )}
//                 </Box>

//                 {/* RIGHT SIDE - Big Chess Board */}
//                 <Box flex="1" w="full" minW={{ md: "420px" }} maxW={{ md: "50%" }} >
//                     {/* Pass currentFen and a key to force remount */}
//                     {currentFen ? (
//                         <ChessGame key={currentFen} initialFen={currentFen} />
//                     ) : (
//                         // Show placeholder if no FEN is loaded yet or available
//                         <Flex height="420px" width="420px" borderWidth="1px" borderRadius="md" align="center" justify="center" bg="gray.100">
//                            <Text color="gray.500">Select a position to load</Text>
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
    Box, Heading, Text, Spinner, Flex, Image,
    Button, Wrap, WrapItem, useToast
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

    useEffect(() => {
        setLoading(true);
        setError(null);
        setOriginalFen(null);
        setCurrentFen(null);
        setActiveFenSource(null);
        let principleIdToFetch = null;

        const storyRequest = axios.get(`http://localhost:5000/stories/${storyId}`)
            .then(response => {
                if (!response.data) throw new Error("Story not found");
                setStory(response.data);
            }).catch(error => {
                console.error(error);
                setError("Error fetching story.");
            });

        const mappingRequest = axios.get(`http://localhost:5000/story-mappings/${storyId}`)
            .then(response => {
                const foundMapping = response.data.find(m => m.mapping_id.toString() === mappingId.toString());
                if (!foundMapping) throw new Error("Mapping not found for this story");
                setMapping(foundMapping);
                principleIdToFetch = foundMapping.principle_id;
            }).catch(error => {
                console.error(error);
                setError("Error fetching mapping.");
            });

        Promise.all([storyRequest, mappingRequest])
            .then(() => {
                if (principleIdToFetch) {
                    return axios.get(`http://localhost:5000/principle/${principleIdToFetch}`)
                        .then(principleRes => {
                            if (!principleRes.data) throw new Error("Principle not found");
                            setPrinciple(principleRes.data);
                            if (principleRes.data.fen_with_move) {
                                setOriginalFen(principleRes.data.fen_with_move);
                                setCurrentFen(principleRes.data.fen_with_move);
                                setActiveFenSource('original');
                            }
                        }).catch(error => {
                            console.error(error);
                            setError("Error fetching principle.");
                        });
                }
            })
            .finally(() => setLoading(false));
    }, [storyId, mappingId]);

    const getCleanedPuzzleArray = (puzzleListString) => {
        if (!puzzleListString || typeof puzzleListString !== 'string') return [];
        let cleaned = puzzleListString.trim();
        if (cleaned.startsWith('[') && cleaned.endsWith(']')) cleaned = cleaned.slice(1, -1);
        cleaned = cleaned.replace(/'/g, '');
        return cleaned.split(',').map(p => p.trim()).filter(Boolean);
    };

    const puzzles = principle ? getCleanedPuzzleArray(principle.puzzle_list) : [];

    const handlePuzzleClick = async (puzzleId) => {
        if (activeFenSource === puzzleId) return;
        setIsPuzzleLoading(true);
        setActiveFenSource(puzzleId);

        try {
            const res = await axios.get(`http://localhost:5000/puzzles/${puzzleId}`);
            if (res.data && res.data.fen_with_move) {
                setCurrentFen(res.data.fen_with_move);
                toast({ title: `Loaded Puzzle ${puzzleId}`, status: 'success', duration: 2000, isClosable: true });
            } else throw new Error("No FEN found");
        } catch (err) {
            toast({ title: "Error Loading Puzzle", description: err.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            setIsPuzzleLoading(false);
        }
    };

    const handleOriginalFenClick = () => {
        if (activeFenSource === 'original' || !originalFen) return;
        setCurrentFen(originalFen);
        setActiveFenSource('original');
        toast({ title: "Loaded Original Position", status: 'info', duration: 2000, isClosable: true });
    };

    if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>;
    if (error) return <Box p={8} textAlign="center" color="red.500"><Heading size="md" mb={4}>Error</Heading><Text>{error}</Text></Box>;

    return (
        <Box p={8} maxW="container.xl" mx="auto">
            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>

                {/* Left Side (Story & Principle) */}
                <Box flex="1" minW={{ md: "40%" }}>
                    <Heading mb={2}>{story.title}</Heading>
                    <Text fontSize="lg" color="gray.600" mb={6}>{story.description}</Text>

                    <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
                        <Heading size="sm" mb={2}>Mapping Message</Heading>
                        <Text>{mapping.story_text}</Text>
                    </Box>

                    {principle && (
                        <Box p={4} bg="gray.100" borderRadius="md">
                            <Heading size="sm" mb={2}>Principle</Heading>
                            <Text mb={4}>{principle.principle}</Text>

                            <Heading size="xs" mb={3} textTransform="uppercase" color="gray.500">Load Position</Heading>
                            <Wrap spacing={3}>
                                {originalFen && (
                                    <WrapItem>
                                        <Button size="sm" colorScheme="blue" variant={activeFenSource === 'original' ? 'solid' : 'outline'}
                                            onClick={handleOriginalFenClick} isDisabled={activeFenSource === 'original'} isLoading={isPuzzleLoading && activeFenSource === 'original'}>
                                            Original
                                        </Button>
                                    </WrapItem>
                                )}
                                {puzzles.map((puzzleId, index) => (
                                    <WrapItem key={index}>
                                        <Button size="sm" colorScheme="teal" variant={activeFenSource === puzzleId ? 'solid' : 'outline'}
                                            onClick={() => handlePuzzleClick(puzzleId)} isLoading={isPuzzleLoading && activeFenSource === puzzleId}
                                            isDisabled={isPuzzleLoading && activeFenSource !== puzzleId}>
                                            {puzzleId}
                                        </Button>
                                    </WrapItem>
                                ))}
                            </Wrap>

                            <Box mt={4}>
                                <Image src={`/story_images/${storyId}.png`} alt={`Story ${storyId}`} borderRadius="md"
                                    boxSize="150px" objectFit="cover" fallbackSrc="https://via.placeholder.com/150?text=No+Image" />
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Right Side (Chess Board) */}
                <Box flex="1" minW={{ md: "67%" }}>
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
