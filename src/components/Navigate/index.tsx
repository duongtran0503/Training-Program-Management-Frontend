import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useState } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { styledSystem } from '../../constans/styled';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';

const ItemMenu1: { title: string; url: string }[] = [
    {
        title: 'Quản lý giảng viên',
        url: '/lecturer',
    },
    {
        title: 'Quản lý khoa',
        url: '/manager/department',
    },
    {
        title: 'Quản lý học phần và đề cương học phần',
        url: '/manager/subject',
    },
    {
        title: 'Quản lý lớp học',
        url: '/manager/class',
    },
];

const ItemMenu2: { title: string; url: string }[] = [
    {
        title: 'Quản lý chương trình đào tạo',
        url: '/manager/training',
    },
    {
        title: 'Quản lý kế hoạch đào tạo',
        url: '/manager/teaching-plan',
    },
    
];

export default function Navigate() {
    const [isOpenTreeMenu2, setisOpenTreeMenu2] = useState<boolean>(false);
    const [isOpenTreeMenu1, setIsOpenTreeMenu1] = useState<boolean>(false);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '70px',
                left: '20px',
                width: '245px',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '710px',
                    margin: '8px ',
                    boxShadow: styledSystem.secondBoxShadow,
                    borderRadius: '10px',
                }}
            >
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 360,
                    }}
                    component='nav'
                    aria-labelledby='nested-list-subheader'
                >
                    <ListItemButton component={Link} to='/statics'>
                        <ListItemIcon>
                            <AddchartIcon />
                        </ListItemIcon>
                        <ListItemText primary='Thống kê' />
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => setIsOpenTreeMenu1(!isOpenTreeMenu1)}
                    >
                        <ListItemIcon>
                            <StorageIcon />
                        </ListItemIcon>
                        <ListItemText primary='Dữ liệu hệ thống' />
                        {isOpenTreeMenu1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpenTreeMenu1} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                            {ItemMenu1.map((item) => {
                                return (
                                    <ListItemButton
                                        sx={{ pl: 4 }}
                                        key={nanoid()}
                                        component={Link}
                                        to={item.url}
                                    >
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Collapse>
                    <ListItemButton
                        onClick={() => setisOpenTreeMenu2(!isOpenTreeMenu2)}
                    >
                        <ListItemIcon>
                            <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary='Chương trình đào tạo' />
                        {isOpenTreeMenu2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpenTreeMenu2} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                            {ItemMenu2.map((item) => {
                                return (
                                    <ListItemButton
                                        sx={{ pl: 4 }}
                                        key={nanoid()}
                                        component={Link}
                                        to={item.url}
                                    >
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Collapse>
                </List>
                <ListItemButton>
                    <ListItemIcon>
                        <SupportAgentIcon />
                    </ListItemIcon>
                    <ListItemText primary='Hỗ trợ' />
                </ListItemButton>
            </Box>
        </Box>
    );
}