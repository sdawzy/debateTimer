import React, {useState, useEffect, Fragment} from 'react';
import end_sound from './resources/notify.wav';
import r30_sound from './resources/split.wav';
import {TimerSetting} from './schema/TimerSetting';

const DebateTimer = () => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeLeftAff, setTimeLeftAff] = useState(0);
    const [timeLeftNeg, setTimeLeftNeg] = useState(0);
    const [running, setRunning] = useState(false);
    const [runningAff, setRunningAff] = useState(false);
    const [runningNeg, setRunningNeg] = useState(false);
    const [selectedStage, setSelectedStage] = useState('');
    const [timerTitle, setTimerTitle] = useState('测试声音');
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isAffTimeUp, setIsAffTimeUp] = useState(false);
    const [isNegTimeUp, setIsNegTimeUp] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        setDarkMode(matchDarkMode.matches);

        const handleChange = (e) => {
            setDarkMode(e.matches);
        };

        // 监听系统深色模式的变化
        matchDarkMode.addEventListener('change', handleChange);

        // 组件卸载时移除监听器
        return () => {
            matchDarkMode.removeEventListener('change', handleChange);
        };
    }, []);

    // 暫時禁用 dark mode
    // useEffect(() => {
    //     if (darkMode) {
    //         document.body.classList.add('dark-mode');
    //     } else {
    //         document.body.classList.remove('dark-mode');
    //     }
    // }, [darkMode]);

    const debateStages = {
        '测试声音': [31],
        '正一立论/反四质询': [210, 90, true],
        '反一立论/正四质询': [90, 210, false],
        '正二驳论/反二驳论': [120, 120, true],
        '二辩对辩': [90, 90, true],
        '正三盘问/反三盘问': [120, 120, true],
        '正三小结/反三小结': [90, 90, true],
        '自由辩论': [240, 240, true],
        '反四总结/正四总结': [210, 210, false]
    }

    const debateStagesOld = {
        '测试声音': 31,
        '正方一辩发言': 210,
        '反方四辩盘问正方一辩': 90,
        '反方一辩发言': 210,
        '正方四辩盘问反方一辩': 90,
        '正方二辩作驳论': 120,
        '反方二辩作驳论': 120,
        '正方二辩对辩反方二辩': 90,
        '正方三辩盘问': 120,
        '反方三辩盘问': 120,
        '正方三辩质询小结': 90,
        '反方三辩质询小结': 90,
        '自由辩论': 240,
        '反方四辩总结陈词': 210,
        '正方四辩总结陈词': 210
        // 刪除戰術暫停
        // '战术暂停': 120,
    };

    const debateSingleDoubleTimerSettings = {
        '测试声音': TimerSetting.single,
        '正一立论/反四质询': TimerSetting.double,
        '反一立论/正四质询': TimerSetting.double,
        '正二驳论/反二驳论': TimerSetting.double,
        '二辩对辩': TimerSetting.double,
        '正三盘问/反三盘问': TimerSetting.double,
        '正三小结/反三小结': TimerSetting.double,
        '自由辩论': TimerSetting.double,
        '反四总结/正四总结': TimerSetting.double,
        // '测试声音': TimerSetting.single,
        // '正方一辩发言': TimerSetting.single,
        // '反方四辩盘问正方一辩': TimerSetting.single,
        // '反方一辩发言': TimerSetting.single,
        // '正方四辩盘问反方一辩': TimerSetting.single,
        // '正方二辩作驳论': TimerSetting.single,
        // '反方二辩作驳论': TimerSetting.single,
        // '正方二辩对辩反方二辩': TimerSetting.double,
        // '正方三辩盘问': TimerSetting.single,
        // '反方三辩盘问': TimerSetting.single,
        // '正方三辩质询小结': TimerSetting.single,
        // '反方三辩质询小结': TimerSetting.single,
        // // '战术暂停': TimerSetting.single,
        // '自由辩论': TimerSetting.double,
        // '反方四辩总结陈词': TimerSetting.single,
        // '正方四辩总结陈词': TimerSetting.single
    }

    useEffect(() => {
        const keys = Object.keys(debateStagesOld);
        setSelectedStage(keys[0]);
        setTimerTitle(keys[0]);
        setTimeLeft(debateStagesOld[keys[0]]);
        setTimeLeftAff(debateStagesOld[keys[0]]);
        setTimeLeftNeg(debateStagesOld[keys[0]]);
    }, []);

    useEffect(() => {
        let interval;
        if (!runningAff && !runningNeg && running && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        if (running && timeLeft === 30) {
            playSound('30');
        }
        if (running && timeLeft === 0) {
            setRunning(false);
            setIsTimeUp(true);
            playSound('end');
            //alert('时间到！');
        }
        return () => clearInterval(interval);
    }, [running, timeLeft, runningAff, runningNeg]);

    useEffect(() => {
        let interval;
        if (runningAff && timeLeftAff > 0) {
            interval = setInterval(() => {
                setTimeLeftAff((prevTime) => prevTime - 1);
            }, 1000);
        }
        if (runningAff && timeLeftAff === 30) {
            playSound('30');
        }
        if (runningAff && timeLeftAff === 0) {
            setRunningAff(false);
            setIsAffTimeUp(true);
            playSound('end');
        }
        return () => clearInterval(interval);
    }, [runningAff, timeLeftAff]);

    useEffect(() => {
        let interval;
        if (runningNeg && timeLeftNeg > 0) {
            interval = setInterval(() => {
                setTimeLeftNeg((prevTime) => prevTime - 1);
            }, 1000);
        }
        if (runningNeg && timeLeftNeg === 30) {
            playSound('30');
        }
        if (runningNeg && timeLeftNeg === 0) {
            setRunningNeg(false);
            setIsNegTimeUp(true);
            playSound('end');
        }
        return () => clearInterval(interval);
    }, [runningNeg, timeLeftNeg]);

    const handleStageSelect = (event) => {
        const stage = event.target.value;
        setSelectedStage(stage);
        setTimerTitle(stage);
        const time = debateStages[stage];
        console.log(time);
        // Only used when the stage is testing
        setTimeLeft(time[0]);
        setIsTimeUp(false);
        setRunning(false);
        
        // if (time.length > 1) {
            // if (time[2]) {
        setTimeLeftAff(time[0]);
        setTimeLeftNeg(time[1]);
        // } else {
        //     setTimeLeftAff(time[1]);
        //     setTimeLeftNeg(time[0]);
        // }
        setIsAffTimeUp(false);
        setIsNegTimeUp(false);
        setIsAffTimeUp(false);
        setIsNegTimeUp(false);
        setRunningAff(false);
        setRunningNeg(false);
        // }

        //     setSelectedStage('自由辩论');
//             setTimerTitle('自由辩论');
//             const time = debateStagesOld['自由辩论'];
//             setTimeLeftAff(time);
//             setTimeLeftNeg(time);
//             setIsAffTimeUp(false);
//             setIsNegTimeUp(false);
//             setRunningAff(false);
//             setRunningNeg(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    };

    useEffect(() => {
        let interval;
        // if (selectedStage !== '自由辩论' && selectedStage !== '正方二辩对辩反方二辩') {
        if (debateSingleDoubleTimerSettings[selectedStage] == TimerSetting.single) {
            if (running && timeLeft > 30) {
                document.getElementById('clock').classList.remove('time-30s-blinking');
            }
            if (running && timeLeft <= 30) {
                interval = setInterval(() => {
                    if (timeLeft === 30) {
                        document.getElementById('clock').classList.add('time-30s-blinking');
                    }
                    if (timeLeft < 27) {
                        document.getElementById('clock').classList.remove('time-30s-blinking');
                    }
                }, 100);
            }
        }
        return () => clearInterval(interval);
    }, [running, timeLeft]);

    useEffect(() => {
        let interval;
        if (runningAff && timeLeftAff > 30) {
            document.getElementById('clockAff').classList.remove('time-30s-blinking');
        }
        if (runningAff && timeLeftAff <= 30) {
            interval = setInterval(() => {
                if (timeLeftAff === 30) {
                    document.getElementById('clockAff').classList.add('time-30s-blinking');
                }
                if (timeLeftAff < 27) {
                    document.getElementById('clockAff').classList.remove('time-30s-blinking');
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [runningAff, timeLeftAff]);

    useEffect(() => {
        let interval;
        if (runningNeg && timeLeftNeg > 30) {
            document.getElementById('clockNeg').classList.remove('time-30s-blinking');
        }
        if (runningNeg && timeLeftNeg <= 30) {
            interval = setInterval(() => {
                if (timeLeftNeg === 30) {
                    document.getElementById('clockNeg').classList.add('time-30s-blinking');
                }
                if (timeLeftNeg < 27) {
                    document.getElementById('clockNeg').classList.remove('time-30s-blinking');
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [runningNeg, timeLeftNeg]);


    const playSound = (mode) => {
        if(mode === 'end') {
            const audio = new Audio(end_sound);
            audio.play().then(r => console.log(r)).catch(e => console.log(e));
        }
        if(mode === '30') {
            const audio = new Audio(r30_sound);
            audio.play().then(r => console.log(r)).catch(e => console.log(e));
        }
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 's' || event.key === 'S') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    !runningAff && setRunningAff(true);
                } else {
                    !running && setRunning(true);
                }
            } else if (event.key === 'p' || event.key === 'P') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    runningAff && setRunningAff(false);
                } else {
                    running && setRunning(false);
                }
            } else if (event.key === 'r' || event.key === 'R') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    !runningAff && setTimeLeftAff(debateStagesOld[selectedStage]);
                    setIsAffTimeUp(false);
                }
                else if (selectedStage === '测试声音') {
                    !running && setTimeLeft(0);
                    setIsTimeUp(false);
                }
                else {
                    !running && setTimeLeft(debateStagesOld[selectedStage]);
                    setIsTimeUp(false);
                }
            } else if (event.key === 'd' || event.key === 'D') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    !runningNeg && setRunningNeg(true);
                }
            } else if (event.key === '[' || event.key === '{') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    runningNeg && setRunningNeg(false);
                }
            } else if (event.key ==='t' || event.key === 'T') {
                if (debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) {
                    !runningNeg && setTimeLeftNeg(debateStagesOld[selectedStage]);
                    setIsNegTimeUp(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // 移除事件监听器
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedStage, running, runningAff, runningNeg]);

    // useEffect(() => {
    //     const handleKeyDown = (event) => {
    //         if (event.key === '1') {
    //             setSelectedStage('正一立论/反四质询');
    //             setTimerTitle('正一立论/反四质询');
    //             const time = debateStagesOld['正方一辩发言'];
    //             // setTimeLeftAff(time);
    //             // setTimeLeftNeg(time);
    //             // setIsAffTimeUp(false);
    //             // setIsNegTimeUp(false);
    //             // setRunningAff(false);
    //             // setRunningNeg(false);

    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '2') {
    //             setSelectedStage('反一立论/正四质询');
    //             setTimerTitle('反一立论/正四质询');
    //             const time = debateStagesOld['反方四辩盘问正方一辩'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '3') {
    //             setSelectedStage('反方一辩发言');
    //             setTimerTitle('反方一辩发言');
    //             const time = debateStagesOld['反方一辩发言'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '4') {
    //             setSelectedStage('正方四辩盘问反方一辩');
    //             setTimerTitle('正方四辩盘问反方一辩');
    //             const time = debateStagesOld['正方四辩盘问反方一辩'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '5') {
    //             setSelectedStage('正方二辩作驳论');
    //             setTimerTitle('正方二辩作驳论');
    //             const time = debateStagesOld['正方二辩作驳论'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '6') {
    //             setSelectedStage('反方二辩作驳论');
    //             setTimerTitle('反方二辩作驳论');
    //             const time = debateStagesOld['反方二辩作驳论'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '7') {
    //             setSelectedStage('正方二辩对辩反方二辩');
    //             setTimerTitle('正方二辩对辩反方二辩');
    //             const time = debateStagesOld['正方二辩对辩反方二辩'];
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '8') {
    //             setSelectedStage('正方三辩盘问');
    //             setTimerTitle('正方三辩盘问');
    //             const time = debateStagesOld['正方三辩盘问'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '9') {
    //             setSelectedStage('反方三辩盘问');
    //             setTimerTitle('反方三辩盘问');
    //             const time = debateStagesOld['反方三辩盘问'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === '0') {
    //             setSelectedStage('正方三辩质询小结');
    //             setTimerTitle('正方三辩质询小结');
    //             const time = debateStagesOld['正方三辩质询小结'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         // if (event.key === 'z' || event.key === 'Z') {
    //         //     setSelectedStage('战术暂停');
    //         //     setTimerTitle('战术暂停');
    //         //     const time = debateStages['战术暂停'];
    //         //     setTimeLeft(time);
    //         //     setTimeLeftAff(time);
    //         //     setTimeLeftNeg(time);
    //         //     setIsTimeUp(false);
    //         //     setIsAffTimeUp(false);
    //         //     setIsNegTimeUp(false);
    //         //     setRunning(false);
    //         //     setRunningAff(false);
    //         //     setRunningNeg(false);
    //         // }
    //         if (event.key === 'x' || event.key === 'X') {
    //             setSelectedStage('自由辩论');
    //             setTimerTitle('自由辩论');
    //             const time = debateStagesOld['自由辩论'];
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === 'c' || event.key === 'C') {
    //             setSelectedStage('反方四辩总结陈词');
    //             setTimerTitle('反方四辩总结陈词');
    //             const time = debateStagesOld['反方四辩总结陈词'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //         if (event.key === 'v' || event.key === 'V') {
    //             setSelectedStage('正方四辩总结陈词');
    //             setTimerTitle('正方四辩总结陈词');
    //             const time = debateStagesOld['正方四辩总结陈词'];
    //             setTimeLeft(time);
    //             setTimeLeftAff(time);
    //             setTimeLeftNeg(time);
    //             setIsTimeUp(false);
    //             setIsAffTimeUp(false);
    //             setIsNegTimeUp(false);
    //             setRunning(false);
    //             setRunningAff(false);
    //             setRunningNeg(false);
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [selectedStage, running, runningAff, runningNeg]);

    //辯論社圖標
    const logo = require("./assets/logo.jpg");

    return (
        <Fragment>
            {/* <div id="timer" className={darkMode ? 'dark-mode' : 'light-mode'}> */}
            <div id="timer" className='light-mode'>
                {/* Debate Club Logo */}
                <img src={logo} alt='Debate Club Logo' className='logo'/>
                {/* <button type='button' onClick={toggleDarkMode}>
                    {darkMode ? '☀' : '🌙'}
                </button> */}
                <br/>
                <select value={selectedStage} onChange={handleStageSelect} className='select'>
                    {Object.keys(debateStages).map((stage) => (
                        <option key={stage} value={stage} title={stage}>
                            {stage}
                        </option>
                    ))}
                </select>
                <h1>{timerTitle}</h1>
                {/*测试声音*/}
                {(selectedStage === '测试声音') ? (
                    <div>
                        <button onClick={() => {
                            setIsTimeUp(false)
                            setRunning(true)
                            //playSound('30')
                            setTimeLeft(30)
                        }}>测试30秒声音</button>
                        <button onClick={() => {
                            setRunning(true)
                            setTimeLeft(0)
                            setIsTimeUp(true)
                            //playSound('end')

                        }}>测试结束声音</button>
                    </div>
                ) : (
                    <div></div>
                )}

                {/* 根据选定的阶段显示不同的计时器和控制按钮 */}
                {(debateSingleDoubleTimerSettings[selectedStage]===TimerSetting.double) ? (
                    (debateStages[selectedStage][2]==true) ? (
                    <div className='debate-timers-container'>
                        <div className='timer-box'>
                            <h3>正方</h3>
                            <h1 className={isAffTimeUp ? 'blinking' : ''} id='clockAff'>{formatTime(timeLeftAff)}</h1>
                            <div className='controls'>
                                <button className={!runningAff ? 'active' : ''} onClick={() => setRunningAff(true)} disabled={runningAff}>
                                    ▶️
                                </button>
                                <button className={runningAff ? 'active' : ''} onClick={() => setRunningAff(false)} disabled={!runningAff}>
                                    ⏸️
                                </button>
                                <button className={!runningAff ? 'active' : ''} onClick={() => {
                                    setIsAffTimeUp(false);
                                    setTimeLeftAff(debateStages[selectedStage][0])
                                }} disabled={runningAff}>
                                    🔃
                                </button>
                            </div>
                        </div>
                        <div className='timer-box'>
                            <h3>反方</h3>
                            <h1 className={isNegTimeUp ? 'blinking' : ''} id='clockNeg'>{formatTime(timeLeftNeg)}</h1>
                            <div className='controls'>
                                <button className={!runningNeg ? 'active' : ''} onClick={() => setRunningNeg(true)} disabled={runningNeg}>
                                    ▶️
                                </button>
                                <button className={runningNeg ? 'active' : ''} onClick={() => setRunningNeg(false)} disabled={!runningNeg}>
                                    ⏸️
                                </button>
                                <button className={!runningNeg ? 'active' : ''} onClick={() => {
                                    setIsNegTimeUp(false);
                                    setTimeLeftNeg(debateStages[selectedStage][1]);
                                }} disabled={runningNeg}>
                                    🔃
                                </button>
                            </div>
                        </div>
                    </div>) : (<div className='debate-timers-container'>
                    <div className='timer-box'>
                        <h3>反方</h3>
                        <h1 className={isNegTimeUp ? 'blinking' : ''} id='clockNeg'>{formatTime(timeLeftNeg)}</h1>
                        <div className='controls'>
                            <button className={!runningNeg ? 'active' : ''} onClick={() => setRunningNeg(true)} disabled={runningNeg}>
                                ▶️
                            </button>
                            <button className={runningNeg ? 'active' : ''} onClick={() => setRunningNeg(false)} disabled={!runningNeg}>
                                ⏸️
                            </button>
                            <button className={!runningNeg ? 'active' : ''} onClick={() => {
                                setIsNegTimeUp(false);
                                setTimeLeftNeg(debateStages[selectedStage][1]);
                            }} disabled={runningNeg}>
                                🔃
                            </button>
                        </div>
                    </div>
                    <div className='timer-box'>
                        <h3>正方</h3>
                        <h1 className={isAffTimeUp ? 'blinking' : ''} id='clockAff'>{formatTime(timeLeftAff)}</h1>
                        <div className='controls'>
                            <button className={!runningAff ? 'active' : ''} onClick={() => setRunningAff(true)} disabled={runningAff}>
                                ▶️
                            </button>
                            <button className={runningAff ? 'active' : ''} onClick={() => setRunningAff(false)} disabled={!runningAff}>
                                ⏸️
                            </button>
                            <button className={!runningAff ? 'active' : ''} onClick={() => {
                                setIsAffTimeUp(false);
                                setTimeLeftAff(debateStages[selectedStage][0])
                            }} disabled={runningAff}>
                                🔃
                            </button>
                        </div>
                    </div>
                    </div>)
                ) : (
                    <div className='timer-box'>
                        <h1 className={isTimeUp ? 'blinking' : 'timer'} id='clock'>{formatTime(timeLeft)}</h1>
                        <div className='controls'>
                            <button className={!running ? 'active' : ''} onClick={() => setRunning(true)} disabled={running}>
                                ▶️
                            </button>
                            <button className={running ? 'active' : ''} onClick={() => setRunning(false)} disabled={!running}>
                                ⏸️
                            </button>
                            <button className={!running ? 'active' : ''} onClick={() => {
                                setIsTimeUp(false);
                                setTimeLeft(debateStagesOld[selectedStage])
                            }} disabled={running}>
                                🔃
                            </button>
                        </div>
                    </div>
                )}
                <h>© 2025 Xinyi Zhang & Yue Zhang. All rights reserved.</h>
            </div>
        </Fragment>
    );
};

export default DebateTimer;
