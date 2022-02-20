import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { memo, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useApp } from '../AppState';
import { Flashcard, FlashCardItem } from '../Components/Flashcard';
import { KeyboardHelper } from '../Components/KeyboardHelper';
import { LoadingCard } from '../Components/LoadingCard';
import { Progress } from '../Components/Progress';
import { FlashCardData } from '../types';

interface FlashcardPageProps {
  card?: FlashCardData;
  quiz?: boolean;
}

const PageComponent: React.FC<FlashcardPageProps> = ({ card, quiz }) => {
  const { cardMode, nextCard, goHome, loading, loadSound, unloadSound, playSound, canPlaySounds, gameStats } = useApp();
  const cardJp = card?.jp;

  useEffect(() => {
    if (canPlaySounds && cardJp) {
      loadSound(cardJp);
    }

    return () => {
      unloadSound();
    };
  }, [cardJp, canPlaySounds, loadSound, unloadSound]);

  const cardData: FlashCardItem = useMemo(() => {
    if (!card) {
      return null;
    } else if (cardMode === 'hiragana') {
      return {
        firstLine: { text: card?.hiragana, lang: 'ja-jp' },
        solution: [
          { text: card?.katakana, lang: 'ja-jp' },
          { text: card?.kanji, lang: 'ja-jp' },
          { text: card?.romaji, lang: 'ja-jp' },
          { text: card?.en, lang: 'en-us' },
        ],
      };
    } else if (cardMode === 'kanji') {
      return {
        firstLine: { text: card?.kanji, lang: 'ja-jp' },
        solution: [
          { text: card?.hiragana, lang: 'ja-jp' },
          { text: card?.katakana, lang: 'ja-jp' },
          { text: card?.romaji, lang: 'ja-jp' },
          { text: card?.en, lang: 'en-us' },
        ],
      };
    } else if (cardMode === 'kana') {
      return {
        firstLine: { text: card?.hiragana || card?.katakana, lang: 'ja-jp' },
        solution: [
          { text: card?.hiragana, lang: 'ja-jp' },
          { text: card?.katakana, lang: 'ja-jp' },
          { text: card?.kanji, lang: 'ja-jp' },
          { text: card?.romaji, lang: 'ja-jp' },
          { text: card?.en, lang: 'en-us' },
        ],
      };
    } else {
      return {
        firstLine: { text: card?.en, lang: 'en-us' },
        solution: [
          { text: card?.hiragana, lang: 'ja-jp' },
          { text: card?.katakana, lang: 'ja-jp' },
          { text: card?.kanji, lang: 'ja-jp' },
          { text: card?.romaji, lang: 'ja-jp' },
        ],
      };
    }
  }, [card, cardMode]);

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Progress status={gameStats.progress} />
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  if (!card?.en) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <Card data-cy="flashcard-not-found">
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Card Not Found
              </Typography>
            </CardContent>
            <CardActions>
              {quiz ? (
                <Button color="primary" onClick={() => nextCard('void')}>
                  Next
                </Button>
              ) : (
                <Button color="primary" onClick={goHome}>
                  Go Home
                </Button>
              )}
            </CardActions>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Progress status={gameStats.progress} />
      <Box sx={{ p: 2 }}>
        <Flashcard
          card={cardData}
          canPlaySounds={canPlaySounds}
          quiz={quiz}
          onPlaySound={playSound}
          onNext={nextCard}
        />
      </Box>
      {!isMobile && quiz && <KeyboardHelper />}
    </Container>
  );
};

export const FlashcardPage = memo(PageComponent);
