// // // import React from 'react';
// // // import {
// // //   Box,
// // //   Flex,
// // //   Heading,
// // //   Spacer,
// // //   IconButton,
// // //   useColorMode,
// // //   useColorModeValue,
// // // } from '@chakra-ui/react';
// // // import { MoonIcon, SunIcon } from '@chakra-ui/icons';

// // // function NavBar() {
// // //   const { colorMode, toggleColorMode } = useColorMode();

// // //   const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
// // //   const backdropFilter = 'blur(8px)';
// // //   const borderColor = useColorModeValue('gray.200', 'gray.700');
// // //   const textColor = useColorModeValue('gray.800', 'gray.100');

// // //   return (
// // //     <Box
// // //       position="sticky"
// // //       top="0"
// // //       zIndex="999"
// // //       bg={bgColor}
// // //       backdropFilter={backdropFilter}
// // //       borderBottom="1px solid"
// // //       borderColor={borderColor}
// // //       px={8}
// // //       py={3}
// // //       boxShadow="sm"
// // //     >
// // //       <Flex align="center">
// // //         <Heading
// // //           size="lg"
// // //           color="teal.500"
// // //           _hover={{ textDecoration: 'none' }}
// // //         >
// // //           Chess By Panchatantra
// // //         </Heading>

// // //         <Spacer />

// // //         <IconButton
// // //           onClick={toggleColorMode}
// // //           icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
// // //           variant="ghost"
// // //           aria-label="Toggle color mode"
// // //           color={textColor}
// // //           _hover={{ bg: 'teal.100' }}
// // //         />
// // //       </Flex>
// // //     </Box>
// // //   );
// // // }

// // // export default NavBar;
// // import React from 'react';
// // import {
// //   Box,
// //   Flex,
// //   Heading,
// //   Spacer,
// //   IconButton,
// //   useColorMode,
// //   useColorModeValue,
// //   HStack, // Import HStack for easier spacing
// // } from '@chakra-ui/react';
// // import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// // import CelebrationButton from './CelebrationButton'; // <-- IMPORT
// // import CameraPiPPage from './CameraPiPPage';

// // function NavBar() {
// //   const { colorMode, toggleColorMode } = useColorMode();

// //   const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
// //   const backdropFilter = 'blur(8px)';
// //   const borderColor = useColorModeValue('gray.200', 'gray.700');
// //   const textColor = useColorModeValue('gray.800', 'gray.100');

// //   return (
// //     <Box
// //       position="sticky"
// //       top="0"
// //       zIndex="999" // Keep NavBar above content, but Confetti will have higher zIndex
// //       bg={bgColor}
// //       backdropFilter={backdropFilter}
// //       borderBottom="1px solid"
// //       borderColor={borderColor}
// //       px={8}
// //       py={3}
// //       boxShadow="sm"
// //     >
// //       <Flex align="center">
// //         <Heading
// //           size="lg"
// //           color="teal.500"
// //           _hover={{ textDecoration: 'none' }}
// //         >
// //           Chess By Panchatantra
// //         </Heading>

// //         <Spacer />

// //         {/* Use HStack to group the buttons */}
// //         <HStack spacing={4}>
// //           {/* Add the Celebration Button here */}
// //           <CelebrationButton />

// //           <IconButton
// //             onClick={toggleColorMode}
// //             icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
// //             variant="ghost"
// //             aria-label="Toggle color mode"
// //             color={textColor}
// //             _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }} // Adjusted hover color
// //           />
// //         </HStack>
// //       </Flex>
// //     </Box>
// //   );
// // }

// // export default NavBar;

// import React from 'react';
// import {
//   Box,
//   Flex,
//   Heading,
//   Spacer,
//   IconButton,
//   useColorMode,
//   useColorModeValue,
//   HStack, // Import HStack for easier spacing
// } from '@chakra-ui/react';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import CelebrationButton from './CelebrationButton'; // <-- IMPORT
// // import CameraPiPPage from '../pages/CameraPiPPage';
// import CameraToggleButton from './CameraToggleButton';

// // inside your HStack in NavBar


// import { useNavigate } from 'react-router-dom'; // Import this at top if using React Router

// function NavBar() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const navigate = useNavigate(); // React Router navigation hook

//   const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
//   const backdropFilter = 'blur(8px)';
//   const borderColor = useColorModeValue('gray.200', 'gray.700');
//   const textColor = useColorModeValue('gray.800', 'gray.100');

//   return (
//     <Box position="sticky" top="0" zIndex="999" bg={bgColor} backdropFilter={backdropFilter}
//       borderBottom="1px solid" borderColor={borderColor} px={8} py={3} boxShadow="sm">
//       <Flex align="center">
//         <Heading size="lg" color="teal.500">Chess By Panchatantra</Heading>
//         <Spacer />
//         <HStack spacing={4}>
    
//           <CelebrationButton />
        

//           <IconButton
//             onClick={toggleColorMode}
//             icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
//             variant="ghost"
//             aria-label="Toggle color mode"
//             color={textColor}
//             _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
//           />
//         </HStack>
//       </Flex>
//     </Box>
//   );
// }

// export default NavBar;
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import CelebrationButton from './CelebrationButton';
import CameraToggleButton from './CameraToggleButton'; // <-- IMPORTANT import

function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const backdropFilter = 'blur(8px)';
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      bg={bgColor}
      backdropFilter={backdropFilter}
      borderBottom="1px solid"
      borderColor={borderColor}
      px={8}
      py={3}
      boxShadow="sm"
    >
      <Flex align="center">
        <Heading size="lg" color="teal.500">
          Chess By Panchatantra
        </Heading>

        <Spacer />

        <HStack spacing={4}>
          {/* Celebration Button */}
          <CelebrationButton />

          {/* Camera Toggle Button -> This will start/stop PiP Camera */}
          <CameraToggleButton />

          {/* Color Mode Button */}
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            aria-label="Toggle color mode"
            color={textColor}
            _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
          />
        </HStack>
      </Flex>
    </Box>
  );
}

export default NavBar;
