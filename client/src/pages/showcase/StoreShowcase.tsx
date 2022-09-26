// @mui
import {Button, Container, Stack, Typography} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

import * as React from "react";
import {connect} from "react-redux";
import {Dispatch, RootState} from "../../store";

const mapState = (state: RootState) => ({
    count: state.user?.count,
});
const mapDispatch = (dispatch: Dispatch) => ({
    increment: () => dispatch.user.increment(1),
    decrement: () => dispatch.user.decrement(1),
    // incrementAsync: () => dispatch.user.incrementAsync(1),
});
type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;

function Count(props: Props) {
    return (
        <Stack>
            The count is {props.count}
            <Button onClick={() => props.increment()}>increment</Button>
            <Button onClick={() => props.decrement()}>decrement</Button>
            {/*<Button onClick={() => props.incrementAsync()}>incrementAsync</Button>*/}
        </Stack>
    );
}

const CountContainer = connect(mapState, mapDispatch)(Count);
// ----------------------------------------------------------------------

export default function StoreShowcase() {
    const {themeStretch} = useSettings();

    return (
        <Page title="Store Showcase">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Store Showcase
                </Typography>
                <CountContainer/>
            </Container>
        </Page>
    );
}