import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  CreditCard,
  Brightness4,
  Brightness7,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Menu as MenuIcon,
  Stars as StarsIcon,
} from "@mui/icons-material";
import { useAppTheme } from "../../../core/providers/ThemeRegistry";
import { useAuth } from "../../../core/providers/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCardsForUser } from "../../../core/services/firebaseUtils";
import { onCardUpdate } from "../../../core/utils/events";
import { detectDevice } from "../../../core/utils/deviceUtils";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTablet: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userCardCount, setUserCardCount] = useState(0);
  const isHomePage = pathname === "/";

  useEffect(() => {
    setDeviceInfo(detectDevice());
  }, []);

  useEffect(() => {
    const fetchUserCardCount = async () => {
      if (user) {
        try {
          const userCards = await getCardsForUser(user.uid);
          setUserCardCount(userCards.length);
        } catch (error) {
          console.error("Error fetching user cards:", error);
        }
      }
    };

    fetchUserCardCount();
    const unsubscribe = onCardUpdate(fetchUserCardCount);
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, href: "/" },
    ...(isAuthenticated()
      ? [
          { label: "Calculator", icon: <CalculateIcon />, href: "/calculator" },
          { label: "My Cards", icon: <CreditCard />, href: "/my-cards" },
          {
            label: "Best Card",
            icon: <StarsIcon />,
            href: "/best-card",
            disabled: userCardCount < 2,
            tooltip:
              userCardCount < 2
                ? "Add at least two cards to use this feature"
                : "",
          },
        ]
      : []),
  ];

  const renderMenuItems = () => {
    return menuItems.map(
      (item) =>
        pathname !== item.href && (
          <MenuItem
            key={item.label}
            onClick={handleMenuClose}
            component={Link}
            href={item.href}
            disabled={item.disabled}
          >
            {item.icon}
            <Typography sx={{ ml: 1 }}>{item.label}</Typography>
          </MenuItem>
        )
    );
  };

  // Now render based on device type
  if (deviceInfo.isAndroid || deviceInfo.isIOS) {
    return (
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ position: "relative", width: 40, height: 40, mr: 1 }}>
              <Image
                src={
                  mode === "dark"
                    ? "f4bf16b1-527e-4d80-47b4-99989a1ded00"
                    : "b6c3c6f1-a744-4e47-8c50-4c33c84c3900"
                }
                alt="CCReward Logo"
                width={40}
                height={40}
                priority
              />
            </Box>
            CCReward
          </Typography>

          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }

  const LogoContent = () => (
    <>
      <Box sx={{ position: "relative", width: 40, height: 40, mr: 1 }}>
        <Image
          src={
            mode === "dark"
              ? "f4bf16b1-527e-4d80-47b4-99989a1ded00"
              : "b6c3c6f1-a744-4e47-8c50-4c33c84c3900"
          }
          alt="CCReward Logo"
          width={40}
          height={40}
          priority
        />
      </Box>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 500,
        }}
      >
        CCReward
      </Typography>
    </>
  );

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          "& .MuiButton-root": {
            ml: 2,
          },
          "& .MuiAvatar-root": {
            ml: 2,
            width: 40,
            height: 40,
          },
        }}
      >
        {isHomePage ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LogoContent />
          </Box>
        ) : (
          <Box 
            component={Link} 
            href="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <LogoContent />
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slots={{
                  root: "div",
                  backdrop: "div",
                }}
              >
                {renderMenuItems()}
                {isAuthenticated() && (
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon />
                    <Typography sx={{ ml: 1 }}>Logout</Typography>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              {menuItems.map(
                (item) =>
                  pathname !== item.href && (
                    <Tooltip key={item.label} title={item.tooltip || ""} arrow>
                      <span>
                        <Button
                          color="inherit"
                          startIcon={item.icon}
                          component={Link}
                          href={item.href}
                          sx={{ ml: 2 }}
                          disabled={item.disabled}
                        >
                          {item.label}
                        </Button>
                      </span>
                    </Tooltip>
                  )
              )}

              {user && <ProfileMenu user={user} onLogout={handleLogout} />}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
