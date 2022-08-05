import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import participantsStyles from '../styles/Participants.module.css'

const Participants: NextPage = () => {
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [participants, setParticipants] = useState<string[]>([]);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string>("");

  const [drawing, setDrawing] = useState(false);

  const addParticipant = () => {
    if (currentName) {
      const currentParticipants = participants;
      currentParticipants.push(currentName);
      setParticipants(currentParticipants);
      setCurrentName("");
      inputNameRef.current?.focus();
    }
  }

  const makeDraw = () => {
    setDrawing(true);
    let pot: string[] = [];
    const sortedSequence: string[] = [];

    participants.map((name, index) => {
      for (let i = -1; i < index; i++) {
        pot.push(name);
      }
    });

    while (pot.length > 0) {
      const sortedIndex = Math.floor((Math.random() * (pot.length - 1)) + 0);
      const sortedName = pot[sortedIndex];

      sortedSequence.push(sortedName);

      pot = pot.filter(name => name !== sortedName);
    }

    setSequence(sortedSequence);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Liga FIFA Seridó</title>
        <meta name="description" content="Draft Liga Fifa Seridó" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.logocontainer}>
        <Link href={'/'}>
          <Image src="/images/lfslogo.jpeg" alt="LFS Logo" width={100} height={100} className={styles.logo} />
        </Link>
        <h1 className={participantsStyles.draft}>#DRAFT</h1>
      </div>

      {!drawing &&
        <div className={participantsStyles.participants}>
          <h3>Quem vai participar do #draft? Adicione os participantes em ordem crescente de peso.</h3>
          <div className={participantsStyles.addparticipant}>
            <input ref={inputNameRef} value={currentName} onChange={e => setCurrentName(e.target.value)} type="text" placeholder="Nome" />
            <button onClick={addParticipant}>+</button>
          </div>

          <div>
            {
              participants.map((name, index) => {
                return <p key={index} className={participantsStyles.name}>{index < 9 ? `0${index + 1}` : `${index + 1}`}. {name}</p>
              })
            }
          </div>

          {participants.length > 0 && <button onClick={makeDraw} className={participantsStyles.draw}>REALIZAR SORTEIO</button>}
        </div>
      }

      {drawing &&
        <div className={participantsStyles.participants}>
          <h3>Aqui está a sequência sorteada!</h3>

          <span>- Limite de escolhas: 5</span>
          <span>- Colocar Nome e Sobrenome abaixo do nome do clube <strong>(em negrito)</strong></span>
          <span>- Mencionar o próximo coleguinha após a escolha</span>
          <span>- 30 minutos para cada time</span>

          <br />
          
          <div>
            {
              sequence.map((name, index) => {
                return <p key={index} className={participantsStyles.name}>{index < 9 ? `0${index + 1}` : `${index + 1}`}. {name}</p>
              })
            }
          </div>
        </div>
      }
      <footer className={styles.footer}>
        <span>Feito com carinho  &#x2764; pelo "Dev"</span>
      </footer>
    </div>
  )
}

export default Participants
