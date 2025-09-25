// import React from "react";
// import Particles from "react-tsparticles";
// import { Box, Typography, Button, Paper, Stack, Avatar, Fade } from "@mui/material";
// import SecurityIcon from "@mui/icons-material/Security";

// const particleOptions = {
//   fullScreen: { enable: false },
//   background: { color: "#f5f7fa" },
//   particles: {
//     number: { value: 24, density: { enable: true, area: 900 } },
//     color: { value: ["#ffdee9", "#b5fffc", "#fbc2eb", "#a18cd1", "#fad0c4"] },
//     shape: { type: "circle" },
//     opacity: { value: 0.29, random: true },
//     size: { value: 120, random: { enable: true, minimumValue: 40 } },
//     move: { enable: true, speed: 0.7, outModes: "out" },
//     zIndex: { value: 0 }
//   }
// };

// export default function Landing() {
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         minHeight: "100vh",
//         width: "100vw",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(120deg, #ffdee9 0%, #a18cd1 100%)",
//       }}
//     >
//       <Particles
//         id="tsparticles"
//         options={particleOptions}
//         style={{
//           position: "absolute",
//           inset: 0,
//           zIndex: 0,
//         }}
//       />

//       <Fade in timeout={1200}>
//         <Paper
//           elevation={16}
//           sx={{
//             width: "100%",
//             maxWidth: 460,
//             mx: "auto",
//             px: { xs: 2, sm: 4 },
//             py: { xs: 3, sm: 4 },
//             position: "relative",
//             borderRadius: 5,
//             background: "rgba(255,255,255,0.91)",
//             backdropFilter: "blur(18px)",
//             boxShadow: "0 8px 40px 0 rgba(31, 38, 135, 0.17)",
//             zIndex: 2,
//           }}
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: -44,
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               background: "linear-gradient(125deg, #a18cd1, #ffdee9, #fad0c4)",
//               boxShadow: "0 0 32px 12px rgba(255,222,233,0.3)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 3,
//             }}
//           >
//             <Avatar
//               sx={{
//                 bgcolor: "white",
//                 width: 62,
//                 height: 62,
//                 boxShadow: "0 0 14px 4px rgba(255,255,255,0.11)",
//               }}
//             >
//               <SecurityIcon sx={{ fontSize: 42, color: "#b5fffc" }} />
//             </Avatar>
//           </Box>
//           <Box sx={{ height: 48 }} />

//           <Typography
//             variant="h3"
//             sx={{
//               fontWeight: 800,
//               letterSpacing: "0.08em",
//               color: "#233267",
//               mb: 1,
//               fontSize: { xs: "2rem", sm: "2.4rem" },
//               textShadow: "0 2px 12px rgba(35,50,103,0.15)",
//               textAlign: "center",
//             }}
//           >
//             Vigilant
//           </Typography>

//           <Typography
//             variant="body1"
//             sx={{
//               color: "#374151",
//               fontWeight: 600,
//               fontSize: { xs: "1rem", sm: "1.15rem" },
//               lineHeight: 1.6,
//               textAlign: "center",
//               mb: 3,
//               whiteSpace: "pre-line",
//               px: { xs: 1, sm: 2 },
//             }}
//           >
//             {"Next-gen safety & emergency platform.\nQuick connect. Smart protection.\nPeace of mind."}
//           </Typography>

//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             spacing={2}
//             justifyContent="center"
//           >
//             <Button
//               href="/register"
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 6,
//                 fontWeight: 700,
//                 fontSize: { xs: "1rem", sm: "1.16rem" },
//                 background: "linear-gradient(90deg, #ffdee9 8%, #a18cd1 92%)",
//                 boxShadow: "0 6px 24px rgba(255,222,233,0.18)",
//                 textTransform: "none",
//                 "&:hover": { filter: "brightness(0.96)" },
//               }}
//             >
//               Register
//             </Button>
//             <Button
//               href="/login"
//               variant="outlined"
//               color="primary"
//               size="large"
//               sx={{
//                 borderRadius: 20,
//                 px: 6,
//                 fontWeight: 700,
//                 fontSize: { xs: "1rem", sm: "1.16rem" },
//                 borderWidth: 2,
//                 borderColor: "#a18cd1",
//                 color: "#a18cd1",
//                 textTransform: "none",
//                 "&:hover": {
//                   backgroundColor: "#a18cd1",
//                   color: "#fff",
//                   borderColor: "#a18cd1",
//                 },
//               }}
//             >
//               Login
//             </Button>
//           </Stack>

//           <Box
//             sx={{
//               height: 16,
//               width: 110,
//               mx: "auto",
//               mt: 3,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(ellipse at center, rgba(161, 140, 209, 0.27), transparent 90%)",
//             }}
//           />
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }


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
