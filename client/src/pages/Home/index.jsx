import classes from './styles.module.scss';
import ListThreads from '../../components/Thread/List';

function Home() {
    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <ListThreads />
            </div>
        </div>
    );
}

export default Home;