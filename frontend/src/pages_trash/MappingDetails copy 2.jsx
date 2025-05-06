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
        <Box p={8} maxW="container.xl"  ml="0" mr="0">
            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>

                {/* Left Side (Story & Principle) */}
                <Box flex="1" minW={{ md: "40%" }}>
                    <Heading mb={2}>{story.title}</Heading>
                    <Text fontSize="lg" color="gray.600" mb={6}>{story.description}</Text>

                    <Flex mt={4} align="start" gap={6} ml="0" mr="-10">
                        {/* <Box>
                            <Image 
                                src={`/story_images/${storyId}.png`} 
                                alt={`Story ${storyId}`} 
                                borderRadius="md"
                                width="400px"       // <- increase width here
                                height="auto"  
                                fallbackSrc="https://via.placeholder.com/150?text=No+Image" 
                            />
                        </Box> */}

                        {/* <Box p={4} bg="gray.50" borderRadius="md" mb={6} w="840px" mr="-105" ml="0">
                            <Heading size="sm" mb={2}>Story Message</Heading>
                            <Text>{mapping.story_text}</Text>
                        </Box> */}
                    </Flex>


                        {principle && (
                            
                            <Box w="630px" mt="5">
                                    {/* <Box display="flex" justifyContent="center" alignItems="center" mt="-5" mb="5">
                                        <Image 
                                            src={`/story_images/${parseInt(storyId.replace(/\D/g, ''), 10)}.png`} 
                                            alt={`Story ${storyId}`} 
                                            borderRadius="md"
                                            justify="center"
                                            // width="400px"       // <- increase width here
                                            height="auto"  
                                            fallbackSrc="https://via.placeholder.com/150?text=No+Image" 
                                        />
                                    </Box> */}
                                
                                    <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
                                        <Heading size="sm" mb={2}>Story Message</Heading>
                                        <Text>{mapping.story_text}</Text>
                                    </Box>
                                {/* Principle Box */}
                                <Box p={4} bg="gray.100" borderRadius="md" mb={4}>
                                    <Heading size="sm" mb={2}>Principle</Heading>
                                    <Text>{principle.principle}</Text>
                                </Box>

                                {/* Load Position Box */}
                                <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
                                    <Heading size="xs" mb={3} textTransform="uppercase" color="gray.500">Load Position</Heading>
                                    <Wrap spacing={3}>
                                        {originalFen && (
                                            <WrapItem>
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="blue" 
                                                    variant={activeFenSource === 'original' ? 'solid' : 'outline'}
                                                    onClick={handleOriginalFenClick} 
                                                    isDisabled={activeFenSource === 'original'} 
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
                                                    colorScheme="teal" 
                                                    w="30px"
                                    
                                                    variant={activeFenSource === puzzleId ? 'solid' : 'outline'}
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
                            </Box>
                        )}

                </Box>

                {/* Right Side (Chess Board) */}
                <Box flex="1"  minW={{ md: "67%" }} mr="0" ml="140">
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
