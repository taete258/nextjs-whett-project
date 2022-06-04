import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Row, Text } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch, useTheme } from '@nextui-org/react';
import ContentPage from './contentPage';

export default function Home() {
  const { setTheme } = useNextTheme();
  const { isDark, type, theme } = useTheme();
  return (
    <>
      <Head>
        <title>Whett</title>
        <meta
          name="viewport"
          content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <div className={styles.container}>
        <header
          style={{
            backgroundColor: theme.colors.blue600.value,
          }}
        >
          <div className={styles.header}>
            <Row
              style={{
                justifyContent: 'space-between',
              }}
            >
              <Text
                className={styles.hearder_title}
                style={{
                  backgroundColor: '#fff',
                  color: theme.colors.blue600.value,
                }}
              >
                {' '}
                Whett
              </Text>
              <Switch
                style={{
                  alignSelf: 'center',
                }}
                bordered
                checked={isDark}
                iconOn={
                  <i
                    className="bx bx-moon"
                    style={{
                      color: theme.colors.white.value,
                    }}
                  />
                }
                iconOff={
                  <i
                    className="bx bx-sun"
                    style={{
                      color: theme.colors.blue700.value,
                    }}
                  />
                }
                onChange={(e) =>
                  setTheme(e.target.checked ? 'dark' : 'light')
                }
              />
            </Row>
          </div>
        </header>
        <main
          className={styles.main}
          style={{
            backgroundColor: isDark
              ? theme.colors.black.value
              : theme.colors.white.value,
            overflow: 'auto',
            padding: 5,
          }}
        >
          <ContentPage props={'yyyssss'} test={'aaaa'} />
        </main>

        <footer
          className={styles.footer}
          style={{
            backgroundColor: isDark
              ? theme.colors.black.value
              : theme.colors.white.value,
          }}
        >
          <span
            style={{
              color: isDark
                ? theme.colors.white.value
                : theme.colors.black.value,
            }}
          >
            Dev by Ratchanon Pheungta
          </span>
          <a
            href="https://www.linkedin.com/in/ratchanon-pheungta-6846a9229/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social_icon}
            style={{
              color: isDark
                ? theme.colors.white.value
                : theme.colors.blue700.value,
            }}
          >
            <i className="bx bxl-linkedin-square"></i>
          </a>
        </footer>
      </div>
    </>
  );
}
