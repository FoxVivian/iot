import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ProfilePage = () => {
  const theme = useTheme();

  return (
    <Box m="20px" p="20px" borderRadius="8px" boxShadow={theme.shadows[3]} bgcolor={theme.palette.background.paper}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <img
            src="\assets\user_sample.png"
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <Typography variant="h3" gutterBottom>
            Phạm Minh Công
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Mã sinh viên: B21DCCN184
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Lớp: D21CQCN04-B
          </Typography>
          <Typography variant="h6" gutterBottom>
            "hewwo"
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <img
            src="\assets\user_sample.png"
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <Typography variant="h3" gutterBottom>
            Ngô Thế Quang Tiến
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Mã sinh viên: B21DCCN458
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Lớp: D21CQCN02-B
          </Typography>
          <Typography variant="h6" gutterBottom>
            "hello hehe"
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <img
            src="\assets\user_sample.png"
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <Typography variant="h3" gutterBottom>
            Trương Công Tuấn Thành
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Mã sinh viên: B21DCCN458
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Lớp: D21CQCN02-B
          </Typography>
          <Typography variant="h6" gutterBottom>
            "hello hehe"
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mb="20px">
          <img
            src="\assets\user_sample.png"
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <Typography variant="h3" gutterBottom>
            Đỗ Đức Hồng Phúc
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Mã sinh viên: B21DCCN458
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Lớp: D21CQCN02-B
          </Typography>
          <Typography variant="h6" gutterBottom>
            "hello hehe"
          </Typography>
        </Box>
      </Box>
      <Box mb="20px">
        <Typography variant="h5" gutterBottom>
          Báo cáo PDF
        </Typography>
        <Link
          href="https://drive.google.com/file/d/15j-ROpHBCqBk7-EV28UvYfoENkB64r2C/view?usp=sharing"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="textSecondary"
        >
          Tải báo cáo
        </Link>
      </Box>

      <Box mb="20px">
        <Typography variant="h5" gutterBottom>
          Link Git
        </Typography>
        <Link
          href="https://github.com/nguyenvietkhiemm/iot"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="textSecondary"
        >
          GitHub Repository
        </Link>
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          API Docs
        </Typography>
        <Link
          href="https://documenter.getpostman.com/view/34072501/2sAXxJib3a"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="textSecondary"
        >
          Xem tài liệu API
        </Link>
      </Box>
    </Box>
  );
};

export default ProfilePage;
