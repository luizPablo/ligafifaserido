import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import participantsStyles from '../styles/Participants.module.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Participants: NextPage = () => {
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [participants, setParticipants] = useState<any[]>([]);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string>("");

  const [drawing, setDrawing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setParticipants(loadParticipants());
  }, []);

  const addParticipant = () => {
    if (currentName) {
      const currentParticipants = participants;

      currentParticipants.push({ name: currentName });
      setParticipants(currentParticipants);
      saveParticipants(currentParticipants);
      setCurrentName("");
      inputNameRef.current?.focus();
    }
  }

  function removeParticipant(index: number) {
    setParticipants(prevParticipants => {
      const newParticipants = [...prevParticipants];
      newParticipants.splice(index, 1);
      saveParticipants(newParticipants);
      return newParticipants;
    });
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const updatedParticipants = Array.from(participants);
    const [movedParticipant] = updatedParticipants.splice(source.index, 1);
    updatedParticipants.splice(destination.index, 0, movedParticipant);

    setParticipants(updatedParticipants);
    saveParticipants(updatedParticipants);
  };

  const makeDraw = () => {
    setDrawing(true);
    let pot: string[] = [];
    const sortedSequence: any[] = [];

    participants.map((participant, index) => {
      for (let i = -1; i < index; i++) {
        pot.push(participant.name);
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

  function saveParticipants(participants: any[]) {
    if (isClient) {
      localStorage.setItem('participants', JSON.stringify(participants));
    }
  }

  function loadParticipants() {
    const participants = localStorage.getItem('participants');
    if (participants) {
      return JSON.parse(participants);
    }

    return [];
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addParticipant();
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Liga FIFA Seridó</title>
        <meta name="description" content="Draft Liga Fifa Seridó" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.logocontainer}>
        <Link href={'/'}>
          <Image src="/images/lfeafclogo.png" alt="LFS Logo" width={100} height={100} className={styles.logo} />
        </Link>
        <h1 className={participantsStyles.draft}>#DRAFT</h1>
      </div>

      {!drawing &&
        <div className={participantsStyles.participants}>
          <h3>Quem vai participar do #draft? Adicione os participantes em ordem crescente de peso.</h3>
          <div className={participantsStyles.addparticipant}>
            <input
              ref={inputNameRef}
              value={currentName}
              onChange={e => setCurrentName(e.target.value.toUpperCase())}
              type="text"
              placeholder="Nome"
              onKeyDown={handleKeyDown}
            />
            <button onClick={addParticipant}>+</button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            {isClient &&
              <Droppable droppableId="participants-drop">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {participants.map((participant, index) => (
                      <Draggable key={index} draggableId={index.toString()} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <div className={participantsStyles.participantItem}>
                              <span className={participantsStyles.participantItemDrag}>=</span>
                              <p className="name">{index < 9 ? `0${index + 1}` : `${index + 1}`}. {participant.name}</p>
                              <button onClick={() => removeParticipant(index)} className={participantsStyles.participantItemButton}>×</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            }
          </DragDropContext>

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
        <span>Feito com carinho ♥️ pelo &quot;Dev&quot;</span>
      </footer>
    </div>
  )
}

export default Participants
