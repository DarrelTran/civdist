import { useNavigate } from 'react-router-dom';
import styles from './homePage.module.css';
import common from './common.module.css';
import Marquee from '../components/marquee/marquee';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../utils/constants';
import titleImg from '../images/title.png'

const HomePage = () => 
{
    const nav = useNavigate();

    return (
        <div className={common.body}>
            <Marquee 
                text={TITLE_TEXT} 
                animTimeMS={TITLE_CHAR_ANIM_TIME_MS} 
                animTimeDelayMS={TITLE_CHAR_ANIM_DELAY_MS} 
                textDefaultColor='black' 
                textMovingColor={[0, 256]}
                topDivClassName={common.title}
            />

            <img src={titleImg} alt='civdist map preview' className={styles.titleImg}/>

            <div className={styles.titleOptions}>
                <button className={common.smallButton} onClick={e => nav('/signup')}>Sign Up</button>
                <button className={common.smallButton} onClick={e => nav('/login')}>Login</button>
                <button className={common.smallButton} onClick={e => nav('/map')}>Create A New Map</button>
            </div>
        </div>
    );
};

export default HomePage;