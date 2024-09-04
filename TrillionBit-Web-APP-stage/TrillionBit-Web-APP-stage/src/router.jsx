import React from 'react';
import { Switch, Route } from "react-router";

export default (
    <Route>
        <Route path="/" />
        <Route path="/trading" />
        <Route path="/trading/:cryptoAsset" />
        <Route path="/register" />
        <Route path="/buy-sell-swap" />
        <Route path="/register/:referralId" />
        <Route path="/login" />
        <Route path="/email-verification" />
        <Route path="/forgot-password" />
        <Route path="/reset-password/:emailToken" />
        <Route path="/fees" />
        <Route path="/referral-info" />
        <Route path="/terms-of-service" />
        <Route path="/trust-and-security" />
    </Route>
);
