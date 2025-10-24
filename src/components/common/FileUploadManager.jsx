import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Download,
  Visibility,
  AttachFile,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import fileUploadApi from '../../api/fileUploadApi';

/**
 * File Upload Manager Component
 * Comprehensive file management component following README 19 specifications
 * Supports upload, download, info, and delete operations with validation
 */
function FileUploadManager({
  fileTypes = ['All'],
  maxFiles = 10,
  vehicleId = null,
  onFileUploaded = null,
  onFileDeleted = null,
  showFileList = true,
  allowMultiple = true,
  compact = false
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileInfoDialog, setFileInfoDialog] = useState({ open: false, file: null });

  // Handle file selection
  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (!allowMultiple && selectedFiles.length > 1) {
      setError('Chỉ được chọn một file');
      return;
    }

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Không được vượt quá ${maxFiles} files`);
      return;
    }

    // Validate files
    const validation = fileUploadApi.validateMultipleFiles(selectedFiles);
    
    if (!validation.isValid) {
      const errorMessages = validation.invalidFiles.map(f => 
        `${f.file}: ${f.validation.errors.join(', ')}`
      );
      setError(errorMessages.join('\n'));
      return;
    }

    // Upload files
    await uploadFiles(selectedFiles);
    
    // Clear input
    event.target.value = '';
  };

  // Upload files with progress tracking
  const uploadFiles = async (filesToUpload) => {
    setUploading(true);
    setError('');
    
    try {
      for (const file of filesToUpload) {
        const fileId = Date.now() + Math.random();
        
        // Add to files list with pending status
        setFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
          localFile: file
        }]);

        // Prepare metadata
        const metadata = {
          fileType: fileTypes[0] !== 'All' ? fileTypes[0] : 'Other'
        };
        
        if (vehicleId) {
          metadata.vehicleId = vehicleId;
        }

        try {
          // Upload with progress tracking
          const response = await fileUploadApi.uploadWithProgress(
            file,
            metadata,
            (percent, loaded, total) => {
              setUploadProgress(prev => ({
                ...prev,
                [fileId]: { percent, loaded, total }
              }));
              
              // Update file progress
              setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, progress: percent } : f
              ));
            }
          );

          // Update file with server response
          const serverFile = response.data.data;
          setFiles(prev => prev.map(f => 
            f.id === fileId ? {
              ...f,
              ...serverFile,
              status: 'uploaded',
              progress: 100,
              serverId: serverFile.fileId,
              uploadDate: serverFile.uploadDate
            } : f
          ));

          // Call callback
          if (onFileUploaded) {
            onFileUploaded(serverFile);
          }
          
          setSuccess(`${file.name} đã được tải lên thành công`);

        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          
          // Update file with error status
          setFiles(prev => prev.map(f => 
            f.id === fileId ? {
              ...f,
              status: 'error',
              error: uploadError.message || 'Upload failed'
            } : f
          ));
          
          setError(`Lỗi tải lên ${file.name}: ${uploadError.message}`);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  // Download file
  const handleDownload = async (file) => {
    try {
      if (file.serverId) {
        await fileUploadApi.downloadFileWithName(file.serverId, file.name);
      } else {
        setError('File chưa được tải lên server');
      }
    } catch (err) {
      setError('Lỗi khi tải file: ' + err.message);
    }
  };

  // Get file info
  const handleViewInfo = async (file) => {
    if (!file.serverId) {
      setFileInfoDialog({ open: true, file });
      return;
    }

    try {
      const response = await fileUploadApi.getInfo(file.serverId);
      const fileInfo = fileUploadApi.formatFileInfoForDisplay(response.data.data);
      setFileInfoDialog({ open: true, file: fileInfo });
    } catch (err) {
      setError('Lỗi khi lấy thông tin file: ' + err.message);
    }
  };

  // Delete file
  const handleDelete = async (file) => {
    if (!window.confirm(`Bạn có chắc muốn xóa file "${file.name}"?`)) {
      return;
    }

    try {
      if (file.serverId) {
        await fileUploadApi.delete(file.serverId);
      }
      
      // Remove from local list
      setFiles(prev => prev.filter(f => f.id !== file.id));
      
      // Call callback
      if (onFileDeleted) {
        onFileDeleted(file);
      }
      
      setSuccess(`${file.name} đã được xóa`);
    } catch (err) {
      setError('Lỗi khi xóa file: ' + err.message);
    }
  };

  // Get file icon and color
  const getFileDisplay = (file) => {
    if (file.localFile || file.type) {
      return fileUploadApi.getFileTypeCategory(file.type || file.localFile?.type);
    }
    return { icon: '📎', color: '#9E9E9E', category: 'unknown' };
  };

  // Render upload area
  const renderUploadArea = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' }
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            multiple={allowMultiple}
            accept={fileTypes.includes('All') ? '*' : fileTypes.map(t => `.${t.toLowerCase()}`).join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {allowMultiple ? 'Chọn files để tải lên' : 'Chọn file để tải lên'}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Hỗ trợ: {fileTypes.join(', ')} • Tối đa 10MB mỗi file
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AttachFile />}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            Chọn Files
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Render file list
  const renderFileList = () => {
    if (!showFileList || files.length === 0) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Files đã chọn ({files.length}/{maxFiles})
          </Typography>
          
          <List>
            {files.map((file) => {
              const display = getFileDisplay(file);
              const progress = uploadProgress[file.id];
              
              return (
                <ListItem key={file.id}>
                  <ListItemIcon>
                    <Box sx={{ fontSize: 24, color: display.color }}>
                      {display.icon}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">{file.name}</Typography>
                        <Chip
                          label={file.status === 'uploading' ? 'Đang tải...' : 
                                file.status === 'uploaded' ? 'Thành công' :
                                file.status === 'error' ? 'Lỗi' : 'Chờ'}
                          color={file.status === 'uploaded' ? 'success' : 
                                file.status === 'error' ? 'error' : 'default'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption">
                          {fileUploadApi.formatFileSize(file.size)} • {display.category}
                        </Typography>
                        
                        {file.status === 'uploading' && progress && (
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.percent}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {progress.percent}% - {fileUploadApi.formatFileSize(progress.loaded)} / {fileUploadApi.formatFileSize(progress.total)}
                            </Typography>
                          </Box>
                        )}
                        
                        {file.error && (
                          <Typography variant="caption" color="error">
                            {file.error}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewInfo(file)}
                        title="Xem thông tin"
                      >
                        <Visibility />
                      </IconButton>
                      
                      {file.status === 'uploaded' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file)}
                          title="Tải xuống"
                        >
                          <Download />
                        </IconButton>
                      )}
                      
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(file)}
                        title="Xóa file"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  };

  // File info dialog
  const renderFileInfoDialog = () => (
    <Dialog
      open={fileInfoDialog.open}
      onClose={() => setFileInfoDialog({ open: false, file: null })}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Thông tin file</DialogTitle>
      <DialogContent>
        {fileInfoDialog.file && (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Tên file:</strong> {fileInfoDialog.file.fileName || fileInfoDialog.file.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Kích thước:</strong> {fileInfoDialog.file.formattedSize || fileUploadApi.formatFileSize(fileInfoDialog.file.size)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Loại file:</strong> {fileInfoDialog.file.fileType || fileInfoDialog.file.type}
            </Typography>
            {fileInfoDialog.file.formattedCreatedAt && (
              <Typography variant="body1" gutterBottom>
                <strong>Ngày tải lên:</strong> {fileInfoDialog.file.formattedCreatedAt}
              </Typography>
            )}
            {fileInfoDialog.file.downloadUrl && (
              <Typography variant="body1" gutterBottom>
                <strong>URL tải xuống:</strong> {fileInfoDialog.file.downloadUrl}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFileInfoDialog({ open: false, file: null })}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (compact) {
    return (
      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          disabled={uploading}
          fullWidth
        >
          {files.length > 0 ? `${files.length} files đã chọn` : 'Chọn files'}
          <input
            type="file"
            hidden
            multiple={allowMultiple}
            accept={fileTypes.includes('All') ? '*' : fileTypes.map(t => `.${t.toLowerCase()}`).join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </Button>
        
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
        
        {renderFileInfoDialog()}
      </Box>
    );
  }

  return (
    <Box>
      {renderUploadArea()}
      {renderFileList()}
      
      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess('')}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}
      
      {renderFileInfoDialog()}
    </Box>
  );
}

export default FileUploadManager;