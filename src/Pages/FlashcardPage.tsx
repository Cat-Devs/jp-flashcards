import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useApp } from '../AppState';
import { Flashcard, FlashCardItem } from '../Components/Flashcard';
import { KeyboardHelper } from '../Components/KeyboardHelper';
import { Progress } from '../Components/Progress';
import { FlashCardData } from '../types';

interface FlashcardPageProps {
  card: FlashCardData;
  accuracy?: string;
  quiz?: boolean;
}

const FlashcardPageComponent: React.FC<FlashcardPageProps> = ({ card, quiz, accuracy }) => {
  const { cardMode, nextCard, userLoggedIn, getGameStats, gameStats } = useApp();
  const [loadingSound, setLoadingSound] = useState(true);
  const audioPlayer = useRef<HTMLAudioElement>();
  const cardJp = card.jp;

  useEffect(() => {
    getGameStats();
  }, [getGameStats]);

  useEffect(() => {
    function loadSound(audio: string) {
      fetch('/api/play', {
        method: 'POST',
        body: JSON.stringify({ audio }),
      })
        .then((response) => response.json())
        .then((response) => response.data || '')
        .then((response: string) => {
          const audioData = Buffer.from(response, 'hex');
          const blob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioSrc = webkitURL.createObjectURL(blob);
          audioPlayer.current = new Audio(audioSrc);
          audioPlayer.current.load();
        })
        .catch(() => {
          // User unauthenticated. The audio won't work unless the users logs in
        })
        .finally(() => {
          setLoadingSound(false);
        });
    }

    if (userLoggedIn && cardJp) {
      setLoadingSound(true);
      loadSound(cardJp);
    } else {
      setLoadingSound(false);
    }

    return () => {
      if (!userLoggedIn) {
        return;
      }

      audioPlayer.current?.load();
      audioPlayer.current?.pause();
      audioPlayer.current = undefined;
    };
  }, [cardJp, userLoggedIn]);

  const playSound = useCallback(() => {
    if (!userLoggedIn) {
      return;
    }

    audioPlayer.current?.load();
    audioPlayer.current?.play();
  }, [userLoggedIn]);

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
          canPlaySounds={userLoggedIn}
          loadingSound={loadingSound}
          quiz={quiz}
          onPlaySound={playSound}
          onNext={nextCard}
          accuracy={accuracy}
        />
      </Box>
      <Box sx={{ flex: '1 1 auto' }} />
      {!isMobile && quiz && <KeyboardHelper />}
    </Container>
  );
};

export const FlashcardPage = memo(FlashcardPageComponent);
