import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";

import { string } from "@ioc:Adonis/Core/Helpers";
import Logger from "@ioc:Adonis/Core/Logger";
import Event from "@ioc:Adonis/Core/Event";

import User from "App/Models/User";
import Token from "App/Models/Token";
import SignUpValidator from "App/Validators/SignUpValidator";
import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";

export default class PortalController {
  /** Returns LoginView */
  public async getLoginView({ view }: HttpContextContract) {
    return view.render("portal/loginView");
  }

  /** Logs user in via email & password */
  /** Event -> 'portal.login' */
  public async emailLogin({
    request,
    auth,
    response,
    session,
  }: HttpContextContract) {
    try {
      const email = request.input("email");
      const password = request.input("password");

      await auth.use("web").attempt(email, password);
      await Event.emit("portal:login", { user: auth.user });

      Logger.info("[ Portal ] Logged in");
      return response.redirect("/account");
    } catch (e) {
      Logger.error("[ Portal ] Error logging user in");
      session.flash("error", "Invalid Credentials");
      return response.redirect("/auth/login");
    }
  }

  /** Returns SignupView */
  public async getSignupView({ view }: HttpContextContract) {
    return view.render("portal/signupView");
  }

  /** Signs user up with name, email & password */
  /** Event -> 'portal.signup' */
  public async emailSignup({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    try {
      const payload = await request.validate(SignUpValidator);

      const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
      });

      await auth.use("web").attempt(payload.email, payload.password);

      const short_link = string.generateRandom(16);
      const email_token = string.generateRandom(48);

      const token = await Token.create({
        user_id: user.id,
        short_link: short_link,
        token: email_token,
        type: "email_verification",
        expired: false,
      });

      await Event.emit("portal:signup", { user, token });

      Logger.info("[ Portal ] User signed up");
      session.flash("success", `Welcome aboard!`);
      return response.redirect("/auth/account");
    } catch (e) {
      console.log(e);
      Logger.error("[ Portal ] Error signing user up");
      return session.flash("error", "There was an error signing up");
    }
  }

  /** Returns AccountView */
  public async getAccountView({ view }: HttpContextContract) {
    return view.render("portal/accountView");
  }

  /** Returns ForgotPasswordView */
  public async getForgotPasswordView({ view }: HttpContextContract) {
    return view.render("portal/forgotPasswordView");
  }

  /** Takes an email, checks it exists and generates a new Reset Password Token */
  /** Event -> 'portal.forgotPassword' */
  public async forgotPasswordSubmission({
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = request.body();

      if (!payload.email) {
        session.flash("error", "Please submit an email!");
        return response.redirect().back();
      }

      const existingUser = await User.query()
        .where("email", payload.email)
        .first();

      if (!existingUser) {
        Logger.error("[ Portal ] User does not exist.");
        session.flash("error", "This user does not exist");
        return response.redirect().back();
      }

      const short_link = string.generateRandom(16);
      const email_token = string.generateRandom(48);

      const token = await Token.create({
        user_id: existingUser.id,
        short_link: short_link,
        token: email_token,
        type: "password_reset",
        expired: false,
      });

      await Event.emit("portal:forgotPassword", { user: existingUser, token });

      Logger.info("[ Portal ] Reset Password Email sent.");
      session.flash(
        "success",
        "We've sent you an email with instructions to reset your password."
      );
      return response.redirect().back();
    } catch (error) {
      Logger.error("[ Portal ] Error submitting forget password form");
      return session.flash("error", "Error submitting forget password form");
    }
  }

  /** Returns ResetPasswordView */
  public async getResetPasswordView({
    view,
    request,
    response,
  }: HttpContextContract) {
    const { t } = request.qs();

    if (!t) {
      return response.redirect("/auth/login");
    }

    const existingToken = await Token.query()
      .where("token", t)
      .andWhere("type", "password_reset")
      .andWhere("expired", false)
      .first();

    if (!existingToken) {
      return response.redirect("/auth/login");
    }

    return view.render("portal/resetPasswordView", {
      token: existingToken.token,
    });
  }

  /** Takes a Reset Password Token, and resets a user's password */
  /** Event -> 'portal.resetPassword' */
  public async resetPasswordSubmission({
    request,
    response,
    session,
  }: HttpContextContract) {
    try {
      const payload = await request.validate(ResetPasswordValidator);

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const existingToken = await Token.query()
        .where("token", payload.token)
        .andWhere("type", "password_reset")
        .andWhere("expired", false)
        .andWhere("created_at", ">=", oneHourAgo)
        .first();

      if (!existingToken) {
        Logger.error("[ Portal ] Token does not exist.");
        return response.redirect("/auth/login");
      }

      const existingUser = await User.query()
        .where("id", existingToken.user_id)
        .first();
      if (!existingUser) {
        Logger.error("[ Portal ] User does not exist.");
        session.flash("error", "This user does not exist");
        return response.redirect("/auth/login");
      }

      /** Set the user's password to their form submission */
      existingUser.password = payload.password;
      await existingUser.save();

      existingToken.usedAt = DateTime.now();
      existingToken.expired = true;
      await existingToken.save();

      await Event.emit("portal:resetPassword", {
        user: existingUser,
        token: existingToken,
      });

      session.flash("success", "Password reset");
      return response.redirect("/auth/login");
    } catch (error) {
      Logger.error("[ Portal ] Error resetting password.");
      session.flash("error", "Error resetting password");
    }
  }

  /** Verifies a user's email and redirects them back to their account */
  public async verifyEmail({
    request,
    response,
    session,
  }: HttpContextContract) {
    const { t } = request.qs();

    if (!t) {
      return response.redirect("/account");
    }

    const existingToken = await Token.query()
      .where("token", t)
      .andWhere("type", "email_verification")
      .andWhere("expired", false)
      .first();

    if (!existingToken) {
      Logger.error("[ Portal ] Token does not exist.");
      session.flash("error", "Error verifying your email");
      return response.redirect("/account");
    }

    const existingUser = await User.query()
      .where("id", existingToken.user_id)
      .first();
    if (!existingUser) {
      Logger.error("[ Portal ] User does not exist.");
      session.flash("error", "This user does not exist");
      return response.redirect("/auth/login");
    }

    existingUser.emailVerified = true;
    await existingUser.save();

    await existingToken.delete();

    Logger.info("[ Portal ] Email verified for user");
    session.flash("success", "Email verified");
    return response.redirect("/account");
  }

  /** Logs authenticated user out */
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();
    return response.redirect("/auth/login");
  }
}
