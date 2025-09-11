import React from "react";
import { Box, Typography, Button, Paper, Stack, Avatar, Fade } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

export default function Landing() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #fc6363 0%, #6a82fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 4 },
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Fade in timeout={1200}>
        <Paper
          elevation={12}
          sx={{
            width: "100%",
            maxWidth: 440,
            mx: "auto",
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 4 },
            position: "relative",
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px 0 rgba(31, 38, 135, 0.12)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -44,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6a82fb, #fc6363)",
              boxShadow: "0 0 20px 8px rgba(252, 99, 99, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                width: 62,
                height: 62,
                boxShadow: "0 0 15px 5px rgba(255,255,255,0.7)",
              }}
            >
              <SecurityIcon sx={{ fontSize: 42, color: "#6a82fb" }} />
            </Avatar>
          </Box>

          {/* spacer for avatar */}
          <Box sx={{ height: 48 }} />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#233267",
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.6rem" },
              textShadow: "0 2px 12px rgba(35,50,103,0.14)",
              textAlign: "center",
            }}
          >
            Vigilant
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              lineHeight: 1.6,
              textAlign: "center",
              mb: 3,
              whiteSpace: "pre-line",
              px: { xs: 1, sm: 2 },
            }}
          >
            {"Next-gen safety & emergency platform.\nQuick connect. Smart protection.\nPeace of mind."}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              href="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 20,
                px: 6,
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                background: "linear-gradient(90deg, #fc6363 0%, #6a82fb 100%)",
                boxShadow: "0 6px 24px rgba(252,99,99,0.5)",
                textTransform: "none",
                "&:hover": { filter: "brightness(0.9)" },
              }}
            >
              Register
            </Button>
            <Button
              href="/login"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: 20,
                px: 6,
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                borderWidth: 2,
                borderColor: "#6a82fb",
                color: "#6a82fb",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#6a82fb",
                  color: "#fff",
                  borderColor: "#6a82fb",
                },
              }}
            >
              Login
            </Button>
          </Stack>

          {/* Ambient shadow below card */}
          <Box
            sx={{
              height: 14,
              width: 100,
              mx: "auto",
              mt: 3,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at center, rgba(102, 116, 204, 0.3), transparent 80%)",
            }}
          />
        </Paper>
      </Fade>
    </Box>
  );
}

// import React from 'react';
// import { Box, Typography, Button, Paper, Stack, Avatar, Fade } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';

// export default function Landing() {
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg, #fc5c7d 0%, #6a82fb 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         py: 6,
//       }}
//     >
//       <Fade in timeout={1200}>
//         <Paper
//           elevation={12}
//           sx={{
//             p: { xs: 3, sm: 5 },
//             borderRadius: 7,
//             textAlign: 'center',
//             background: 'rgba(255,255,255,0.65)',
//             backdropFilter: 'blur(16px)',
//             minWidth: { xs: '90vw', sm: 420 },
//             maxWidth: 540,
//             boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.18)',
//           }}
//         >
//           <Avatar
//             sx={{
//               bgcolor: 'primary.main',
//               width: 80,
//               height: 80,
//               mx: 'auto',
//               mb: 2,
//               boxShadow: '0 4px 32px #6a82fb44',
//             }}
//           >
//             <SecurityIcon sx={{ fontSize: 48 }} />
//           </Avatar>
//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: 800,
//               letterSpacing: '0.08em',
//               color: 'primary.main',
//               mb: 1,
//               textShadow: '0 2px 16px #6a82fb33',
//               fontSize: { xs: '2.1rem', sm: '2.7rem' },
//             }}
//           >
//             Vigilant
//           </Typography>
//           <Typography
//             variant="h5"
//             color="secondary"
//             sx={{
//               mb: 3,
//               fontWeight: 600,
//               letterSpacing: '0.03em',
//               fontSize: { xs: '1.1rem', sm: '1.3rem' },
//             }}
//           >
//             Your universal safety & emergency companion.<br />
//             Stay secure, stay connected, stay Vigilant.
//           </Typography>
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={2}
//             justifyContent="center"
//             sx={{ mt: 4 }}
//           >
//             <Button
//               href="/register"
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 5,
//                 fontWeight: 700,
//                 fontSize: '1.1rem',
//                 background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
//                 boxShadow: '0 2px 16px #fc5c7d33',
//                 letterSpacing: '0.03em',
//               }}
//             >
//               Register
//             </Button>
//             <Button
//               href="/login"
//               variant="outlined"
//               color="secondary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 5,
//                 fontWeight: 700,
//                 fontSize: '1.1rem',
//                 background: 'rgba(255,255,255,0.5)',
//                 letterSpacing: '0.03em',
//                 borderWidth: 2,
//                 '&:hover': {
//                   background: 'rgba(255,255,255,0.7)',
//                   borderColor: '#fc5c7d',
//                 },
//               }}
//             >
//               Login
//             </Button>
//           </Stack>
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }

// import React from 'react';
// import { Box, Typography, Button, Paper, Stack, Avatar, Fade } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';

// export default function Landing() {
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg, #fc5c7d 0%, #6a82fb 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         py: 6,
//       }}
//     >
//       <Fade in timeout={1200}>
//         <Paper
//           elevation={12}
//           sx={{
//             p: { xs: 3, sm: 5 },
//             borderRadius: 7,
//             textAlign: 'center',
//             background: 'rgba(255,255,255,0.65)',
//             backdropFilter: 'blur(16px)',
//             minWidth: { xs: '90vw', sm: 420 },
//             maxWidth: 540,
//             boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.18)',
//           }}
//         >
//           <Avatar
//             sx={{
//               bgcolor: 'primary.main',
//               width: 80,
//               height: 80,
//               mx: 'auto',
//               mb: 2,
//               boxShadow: '0 4px 32px #6a82fb44',
//             }}
//           >
//             <SecurityIcon sx={{ fontSize: 48 }} />
//           </Avatar>
//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: 800,
//               letterSpacing: '0.08em',
//               color: 'primary.main',
//               mb: 1,
//               textShadow: '0 2px 16px #6a82fb33',
//               fontSize: { xs: '2.1rem', sm: '2.7rem' },
//             }}
//           >
//             Vigilant
//           </Typography>
//           <Typography
//             variant="h5"
//             color="secondary"
//             sx={{
//               mb: 3,
//               fontWeight: 600,
//               letterSpacing: '0.03em',
//               fontSize: { xs: '1.1rem', sm: '1.3rem' },
//             }}
//           >
//             Your universal safety & emergency companion.<br />
//             Stay secure, stay connected, stay Vigilant.
//           </Typography>
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={2}
//             justifyContent="center"
//             sx={{ mt: 4 }}
//           >
//             <Button
//               href="/register"
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 5,
//                 fontWeight: 700,
//                 fontSize: '1.1rem',
//                 background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
//                 boxShadow: '0 2px 16px #fc5c7d33',
//                 letterSpacing: '0.03em',
//               }}
//             >
//               Register
//             </Button>
//             <Button
//               href="/login"
//               variant="outlined"
//               color="secondary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 5,
//                 fontWeight: 700,
//                 fontSize: '1.1rem',
//                 background: 'rgba(255,255,255,0.5)',
//                 letterSpacing: '0.03em',
//                 borderWidth: 2,
//                 '&:hover': {
//                   background: 'rgba(255,255,255,0.7)',
//                   borderColor: '#fc5c7d',
//                 },
//               }}
//             >
//               Login
//             </Button>
//           </Stack>
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }

