// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import ScrollToTop from './components/ScrollToTop';
import {ProgressBarStyle} from './components/ProgressBar';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import {Provider} from "react-redux";
import {store} from "./store";

// ----------------------------------------------------------------------

export default function App() {
    return (
        <Provider store={store}>
            <MotionLazyContainer>
                <ThemeProvider>
                    <ThemeSettings>
                        <ProgressBarStyle/>
                        <ScrollToTop/>
                        <Router/>
                    </ThemeSettings>
                </ThemeProvider>
            </MotionLazyContainer>
        </Provider>
    );
}
