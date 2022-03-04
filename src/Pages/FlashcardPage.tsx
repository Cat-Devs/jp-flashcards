import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { memo, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { CardStats, useApp } from '../AppState';
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
  const {
    cardMode,
    nextCard,
    goHome,
    loading,
    loadSound,
    unloadSound,
    playSound,
    userLoggedIn,
    getGameStats,
    gameStats,
  } = useApp();
  const cardJp = card?.jp;

  useEffect(() => {
    getGameStats();
  }, [getGameStats]);

  useEffect(() => {
    if (userLoggedIn && cardJp) {
      loadSound(cardJp);
    }

    return () => {
      unloadSound();
    };
  }, [cardJp, userLoggedIn, loadSound, unloadSound]);

  const cardStats: CardStats = useMemo(() => {
    if (!card || !gameStats.cardsStats) {
      return undefined;
    }
    return gameStats.cardsStats.find((cardStat) => cardStat.id === card.id);
  }, [card, gameStats.cardsStats]);

  const cardData: FlashCardItem = useMemo(() => {
    if (!card) {
      return undefined;
    } else if (cardMode === 'hiragana') {
      return {
        category: card.category,
        firstLine: { text: card.hiragana, lang: 'ja-jp' },
        solution: [
          { text: card.katakana, lang: 'ja-jp' },
          { text: card.kanji, lang: 'ja-jp' },
          { text: card.romaji, lang: 'ja-jp' },
          { text: card.en, lang: 'en-us' },
        ],
      };
    } else if (cardMode === 'kanji') {
      return {
        category: card.category,
        firstLine: { text: card.kanji, lang: 'ja-jp' },
        solution: [
          { text: card.hiragana, lang: 'ja-jp' },
          { text: card.katakana, lang: 'ja-jp' },
          { text: card.romaji, lang: 'ja-jp' },
          { text: card.en, lang: 'en-us' },
        ],
      };
    } else if (cardMode === 'kana') {
      return {
        category: card.category,
        firstLine: { text: card.hiragana || card.katakana, lang: 'ja-jp' },
        solution: [
          { text: card.hiragana, lang: 'ja-jp' },
          { text: card.katakana, lang: 'ja-jp' },
          { text: card.kanji, lang: 'ja-jp' },
          { text: card.romaji, lang: 'ja-jp' },
          { text: card.en, lang: 'en-us' },
        ],
      };
    } else {
      return {
        category: card.category,
        firstLine: { text: card.en, lang: 'en-us' },
        solution: [
          { text: card.hiragana, lang: 'ja-jp' },
          { text: card.katakana, lang: 'ja-jp' },
          { text: card.kanji, lang: 'ja-jp' },
          { text: card.romaji, lang: 'ja-jp' },
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
    <Container
      id="FlashCardPage"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      maxWidth="md"
      disableGutters
    >
      <Progress status={gameStats.progress} />
      <Box sx={{ p: 2 }}>
        <Flashcard
          card={cardData}
          stats={cardStats}
          canPlaySounds={userLoggedIn}
          quiz={quiz}
          onPlaySound={playSound}
          onNext={nextCard}
        />
      </Box>
      <Box sx={{ flex: '1 1 auto' }} />
      {!isMobile && quiz && <KeyboardHelper />}
    </Container>
  );
};

export const FlashcardPage = memo(PageComponent);
