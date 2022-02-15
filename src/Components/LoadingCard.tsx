import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

export const LoadingCard: React.FC = () => {
  return (
    <Card data-cy="flashcard-loading">
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="50%" style={{ marginBottom: 6 }} />}
      ></CardHeader>
      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 12 }} />
          <Skeleton animation="wave" height={10} width="50%" style={{ marginBottom: 6 }} />
        </React.Fragment>
      </CardContent>
    </Card>
  );
};
