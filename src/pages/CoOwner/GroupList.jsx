
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, List, ListItem, ListItemText, Box, Avatar, Grid
} from '@mui/material';


export default function GroupList() {
    // Static group and member data from screenshot
    const group = {
        id: 1,
        name: 'Toyota Camry Hybrid',
        memberCount: 4,
        members: [
            { id: 1, name: 'Nguyễn Văn A (Bạn)', role: 'Chủ nhóm', ownership: 40 },
            { id: 2, name: 'Trần Thị B', role: 'Thành viên', ownership: 30 },
            { id: 3, name: 'Lê Văn C', role: 'Thành viên', ownership: 20 },
            { id: 4, name: 'Phạm Thị D', role: 'Thành viên', ownership: 10 },
        ]
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Quản lý nhóm</Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Thành viên nhóm</Typography>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>{group.name} - Nhóm {group.memberCount} người</Typography>
                    <List>
                        {group.members.map((member) => (
                            <ListItem key={member.id} sx={{ display: 'flex', alignItems: 'center', borderRadius: 2, mb: 1, boxShadow: 0, border: '1px solid #f0f0f0' }}>
                                <Avatar sx={{ bgcolor: '#e8f5e9', color: '#388e3c', mr: 2 }}>{member.name.charAt(0)}</Avatar>
                                <Grid container alignItems="center">
                                    <Grid item xs={8} sm={9}>
                                        <Typography sx={{ fontWeight: 600 }}>{member.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                                    </Grid>
                                    <Grid item xs={4} sm={3} textAlign="right">
                                        <Typography sx={{ fontWeight: 600, color: '#388e3c', fontSize: 20 }}>{member.ownership}%</Typography>
                                        <Typography variant="caption" color="text.secondary">Tỷ lệ sở hữu</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}
