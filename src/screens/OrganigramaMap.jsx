/* eslint-disable react/prop-types */
import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  Typography,
  Box,
  IconButton,
  CardContent,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import organization from "./org.json";
import ScrollContainer from "react-indiana-drag-scroll";

import "../App.css";

// Estilos usando styled
const StyledCard = styled(Card)(({ type }) => ({
  display: "inline-block",
  position: "relative",
  zIndex: 999999999,
  borderRadius: 8,
  width: "100%",
  maxWidth: type === "main" ? "400px" : "300px",
  "& .MuiCardHeader-title": {
    fontSize: "1rem",
    lineHeight: "1rem",
    fontWeight: "400",
    textAlign: "center",
  },
  "@media (max-width: 600px)": {
    maxWidth: "100%",
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background,
  minHeight: "100vh",
  width: "100vw",
  overflow: "true",
  backgroundImage: `url("/assets/2.svg")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  padding: theme.spacing(2),
  "@media (max-width: 1024px)": {
    padding: theme.spacing(2),
    backgroundImage: `url("/assets/3.svg")`,
  },
}));

const ContainerBox = styled(Box)(() => ({
  width: "80%",
  margin: "0 auto",
  "@media (max-width: 1024px)": {
    padding: theme.spacing(2),
    width: "100%",
  },
  position: "relative",
  zIndex: 999999999,
}));

const TreeContainer = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  "& ul": {
    padding: "0 0px",
    "@media (max-width: 600px)": {
      padding: "0 0px",
    },
  },
  "& .convergingLines": {
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-20px",
      left: "calc(50% - 50px)",
      width: "100px",
      height: "2px",
      backgroundColor: "#bbc",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: "-40px",
      left: "50%",
      width: "2px",
      height: "20px",
      backgroundColor: "#bbc",
    },
  },
  "& .convergingNode": {
    marginTop: "40px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
});

const ExpandButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expanded",
})(({ theme, expanded }) => ({
  transform: "rotate(0deg)",
  marginTop: -10,
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.short,
  }),
  ...(expanded && {
    transform: "rotate(180deg)",
  }),
}));

function Organization({ org, onCollapse, collapsed }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "account",
    drop: () => ({ name: org.tradingName }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;
  let backgroundColor = "#f84531";
  let border = "none";
  let color = "white";
  let borderBottom = "none";
  let borderRadius = "8px";
  let marginBottom = "0px";

  if (isActive) {
    backgroundColor = "#ddffd2";
  } else if (canDrop) {
    backgroundColor = "#ffeedc";
  }

  if (org.type === 1) {
    backgroundColor = "transparent";
    border = "none";
    color = "#f84531 ";
    borderBottom = "2px solid #f84531";
    borderRadius = "0px";
    marginBottom = "5px";
  } else if (org.type === 2) {
    backgroundColor = "#f94632";
    color = "#ffc7c3";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (org.type === 3) {
    backgroundColor = "#fdb4ae";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (org.type === 4) {
    backgroundColor = "transparent";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  }

  return (
    <StyledCard
      variant="outlined"
      ref={drop}
      style={{
        backgroundColor,
        border,
        color,
        borderBottom,
        borderRadius,
        marginBottom,
      }}
    >
      <CardHeader title={org.tradingName} />
      {onCollapse && (
        <ExpandButton size="small" onClick={onCollapse} expanded={!collapsed}>
          <ExpandMoreIcon />
        </ExpandButton>
      )}
    </StyledCard>
  );
}

function Account({ a }) {
  const [{ isDragging }, drag] = useDrag({
    type: "account",
    item: () => ({
      name: a.name,
      type: "account",
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(`You moved ${item.name} to ${dropResult.name}`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  let backgroundColor = "#f84531";
  let border = "none";
  let color = "white";
  let borderBottom = "none";
  let borderRadius = "8px";
  let marginBottom = "0px";

  if (a.type === 1) {
    backgroundColor = "transparent";
    border = "none";
    color = "#f84531 ";
    borderBottom = "2px solid #f84531";
    borderRadius = "0px";
    marginBottom = "5px";
  } else if (a.type === 2) {
    backgroundColor = "#f94632";
    color = "#ffc7c3";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (a.type === 3) {
    backgroundColor = "#fdb4ae";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (a.type === 4) {
    backgroundColor = "transparent";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  }

  return (
    <StyledCard
      variant="outlined"
      ref={drag}
      style={{
        cursor: "pointer",
        opacity: isDragging ? 0.4 : 1,
        border,
        color,
        borderBottom,
        borderRadius,
        marginBottom,
        backgroundColor,
      }}
    >
      <CardHeader title={a.name} />
    </StyledCard>
  );
}

function Product({ p }) {
  if (!p) return null;

  let backgroundColor = "#f84531";
  let border = "none";
  let color = "white";
  let borderBottom = "none";
  let borderRadius = "8px";
  let marginBottom = "0px";

  if (p.type === 1) {
    backgroundColor = "transparent";
    border = "none";
    color = "#f84531 ";
    borderBottom = "2px solid #f84531";
    borderRadius = "0px";
    marginBottom = "5px";
  } else if (p.type === 2) {
    backgroundColor = "#f94632";
    color = "#ffc7c3";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (p.type === 3) {
    backgroundColor = "#fdb4ae";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  } else if (p.type === 4) {
    backgroundColor = "transparent";
    color = "#f84531 ";
    border = "2px solid #f84531";
    marginBottom = "5px";
    borderBottom = "2px solid #f84531";
  }

  return (
    <StyledCard
      variant="outlined"
      style={{
        backgroundColor,
        border,
        color,
        borderBottom,
        borderRadius,
        marginBottom,
      }}
    >
      <CardContent>
        <Typography variant="subtitle2">{p.name}</Typography>
      </CardContent>
    </StyledCard>
  );
}

function Node({ o, parent }) {
  // Removida la prop isLastNode que no se usaba
  const [collapsed, setCollapsed] = React.useState(o.collapsed);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  React.useEffect(() => {
    o.collapsed = collapsed;
  }, [collapsed, o]);

  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#bbc"}
          lineBorderRadius={"12px"}
          style={{
            width: "100%",
            padding: window.innerWidth > 600 ? "20px" : "10px",
          }}
        >
          {props.children}
        </Tree>
      );

  const content = (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
          key={o.tradingName}
        />
      }
    >
      {!collapsed && (
        <>
          {_.map(o.account, (a) => (
            <TreeNode key={a.name} label={<Account a={a} />}>
              {a.product && (
                <TreeNode
                  key={`${a.name}-product`}
                  label={<Product p={a.product} />}
                />
              )}
            </TreeNode>
          ))}
          {_.map(o.organizationChildRelationship, (c) => (
            <Node key={c.tradingName} o={c} parent={o} />
          ))}
          {o.tradingName ===
            "Mandar a traducción a idioma inglés con el proveedos de manera urgente" && (
            <TreeNode key="createAdocs" />
          )}
        </>
      )}
    </T>
  );

  return content;
}

const theme = createTheme({
  palette: {
    background: "#f94632",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h6: {
      fontSize: "1rem",
      "@media (max-width: 600px)": {
        fontSize: "0.875rem",
      },
    },
    subtitle2: {
      fontSize: "0.875rem",
      "@media (max-width: 600px)": {
        fontSize: "0.75rem",
      },
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px",
          "@media (max-width: 600px)": {
            padding: "8px",
          },
        },
      },
    },
  },
});

export default function OrganigramaMap() {
  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <ScrollContainer
          className="scroll-container"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <ContainerBox>
            <DndProvider backend={HTML5Backend}>
              <TreeContainer>
                <Node o={organization} />
              </TreeContainer>
            </DndProvider>
          </ContainerBox>
        </ScrollContainer>
      </MainContainer>
    </ThemeProvider>
  );
}
