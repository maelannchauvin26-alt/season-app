import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  // =====================================================
  // NAVIGATION / AUTHENTIFICATION
  // =====================================================

  const [mode, setMode] = useState("home");
  const [role, setRole] = useState(null);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // =====================================================
  // PROFIL ATHLÈTE
  // =====================================================

  const [athleteData, setAthleteData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    main_sport: "",
    main_event: "",
    club: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sport, setSport] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [club, setClub] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  // =====================================================
  // RESSENTI
  // =====================================================

  const [fatigue, setFatigue] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [physicalState, setPhysicalState] = useState(5);
  const [pain, setPain] = useState(0);

  const [feelingComment, setFeelingComment] = useState("");
  const [feelingMessage, setFeelingMessage] = useState("");
  const [savingFeeling, setSavingFeeling] = useState(false);

  // =====================================================
  // COMPÉTITIONS
  // =====================================================

  const [competitions, setCompetitions] = useState([]);
  const [loadingCompetitions, setLoadingCompetitions] =
    useState(false);

  const [nextCompetition, setNextCompetition] = useState(null);

  const [showCompetitionForm, setShowCompetitionForm] =
    useState(false);

  const [editingCompetitionId, setEditingCompetitionId] =
    useState(null);

  const [competitionName, setCompetitionName] =
    useState("");

  const [competitionDate, setCompetitionDate] =
    useState("");

  const [competitionEvent, setCompetitionEvent] =
    useState("");

  const [competitionDistance, setCompetitionDistance] =
    useState("");

  const [competitionLocation, setCompetitionLocation] =
    useState("");

  const [competitionObjective, setCompetitionObjective] =
    useState("");

  const [competitionNotes, setCompetitionNotes] =
    useState("");

  const [competitionMessage, setCompetitionMessage] =
    useState("");

  const [savingCompetition, setSavingCompetition] =
    useState(false);

  const [deletingCompetitionId, setDeletingCompetitionId] =
    useState(null);

  // =====================================================
  // OBJECTIFS DE L'ATHLETE
  // =====================================================

  const [mainObjective, setMainObjective] = useState("");
  const [progressObjectives, setProgressObjectives] = useState("");
  const [thingsToImprove, setThingsToImprove] = useState("");
  const [coachFeedback, setCoachFeedback] = useState("");

  const [savingObjectives, setSavingObjectives] = useState(false);
  const [objectivesMessage, setObjectivesMessage] = useState("");
  const [loadingObjectives, setLoadingObjectives] = useState(false);

// =====================================================
// CHARGER LES OBJECTIFS DE L'ATHLETE
// =====================================================

const loadAthleteObjectives = async () => {
  if (!user?.id) return;

  setLoadingObjectives(true);
  setObjectivesMessage("");

  try {
    const { data, error } = await supabase
      .from("athlete_objectives")
      .select(
        "main_objective, progress_objectives, things_to_improve, coach_feedback"
      )
      .eq("athlete_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erreur chargement objectifs :", error);
      setObjectivesMessage(
        "Erreur lors du chargement de tes objectifs."
      );
      return;
    }

    if (!data) {
      setMainObjective("");
      setProgressObjectives("");
      setThingsToImprove("");
      setCoachFeedback("");
      return;
    }

    setMainObjective(data.main_objective || "");
    setProgressObjectives(data.progress_objectives || "");
    setThingsToImprove(data.things_to_improve || "");
    setCoachFeedback(data.coach_feedback || "");
  } catch (error) {
    console.error("Erreur chargement objectifs :", error);
    setObjectivesMessage(
      "Erreur lors du chargement de tes objectifs."
    );
  } finally {
    setLoadingObjectives(false);
  }
};

// =====================================================
// ENREGISTRER LES OBJECTIFS DE L'ATHLETE
// =====================================================

const saveAthleteObjectives = async () => {
  if (!user?.id) {
    setObjectivesMessage("Erreur : utilisateur non connecté.");
    return;
  }

  setSavingObjectives(true);
  setObjectivesMessage("");

  try {
    const { error } = await supabase
      .from("athlete_objectives")
      .upsert(
        {
          athlete_id: user.id,
          main_objective: mainObjective.trim(),
          progress_objectives: progressObjectives.trim(),
          things_to_improve: thingsToImprove.trim(),
        },
        {
          onConflict: "athlete_id",
        }
      );

    if (error) {
      console.error("Erreur sauvegarde objectifs :", error);
      setObjectivesMessage(
        "Erreur lors de l'enregistrement de tes objectifs."
      );
      return;
    }

    setObjectivesMessage("Tes objectifs ont bien été enregistrés.");
    setTimeout(() => {
  setObjectivesMessage("");
}, 3000);
  } catch (error) {
    console.error("Erreur sauvegarde objectifs :", error);
    setObjectivesMessage(
      "Erreur lors de l'enregistrement de tes objectifs."
    );
  } finally {
    setSavingObjectives(false);
  }
};

// =====================================================
// SUPPRIMER LES OBJECTIFS DE L'ATHLETE
// =====================================================

const deleteAthleteObjectives = async () => {
  if (!user?.id) return;

  const confirmed = window.confirm(
    "Supprimer tous tes objectifs enregistrés ?"
  );

  if (!confirmed) return;

  setSavingObjectives(true);
  setObjectivesMessage("");

  try {
    const { error } = await supabase
      .from("athlete_objectives")
      .delete()
      .eq("athlete_id", user.id);

    if (error) {
      console.error("Erreur suppression objectifs :", error);
      setObjectivesMessage(
        "Erreur lors de la suppression de tes objectifs."
      );
      return;
    }

    setMainObjective("");
    setProgressObjectives("");
    setThingsToImprove("");

    setObjectivesMessage("Tes objectifs ont été supprimés.");
    setTimeout(() => {
  setObjectivesMessage("");
}, 3000);
  } catch (error) {
    console.error("Erreur suppression objectifs :", error);
    setObjectivesMessage(
      "Erreur lors de la suppression de tes objectifs."
    );
  } finally {
    setSavingObjectives(false);
  }
};

  // =====================================================
  // BILAN COMPÉTITION
  // =====================================================

  const [showResultForm, setShowResultForm] =
    useState(false);

  const [selectedCompetitionForResult, setSelectedCompetitionForResult] =
    useState(null);

  const [competitionResult, setCompetitionResult] =
    useState("");

  const [competitionTimeResult, setCompetitionTimeResult] =
    useState("");

  const [competitionResultComment, setCompetitionResultComment] =
    useState("");

  const [resultMessage, setResultMessage] =
    useState("");

  const [savingResult, setSavingResult] =
    useState(false);

  // =====================================================
  // COACH
  // =====================================================

  const [coachAthletes, setCoachAthletes] =
    useState([]);

  const [loadingCoachAthletes, setLoadingCoachAthletes] =
    useState(false);

  const [selectedCoachAthlete, setSelectedCoachAthlete] =
    useState(null);

  const [loadingSelectedAthlete, setLoadingSelectedAthlete] =
    useState(false);

  const [selectedAthleteCompetitions, setSelectedAthleteCompetitions] =
    useState([]);

  const [selectedAthleteFeelings, setSelectedAthleteFeelings] =
    useState([]);

  const [selectedAthleteObjectives, setSelectedAthleteObjectives] =
  useState(null);

  const [coachObjectiveFeedback, setCoachObjectiveFeedback] = useState("");
  const [savingCoachObjectiveFeedback, setSavingCoachObjectiveFeedback] =
  useState(false);
  const [coachObjectiveFeedbackMessage, setCoachObjectiveFeedbackMessage] =
  useState("");

  // Navigation interne de l'espace entraîneur
  const [coachTab, setCoachTab] = useState("overview");
  const [athleteProfileTab, setAthleteProfileTab] = useState("overview");
  const [coachFirstName, setCoachFirstName] = useState("");
  const [coachLastName, setCoachLastName] = useState("");
  const [savingCoachProfile, setSavingCoachProfile] = useState(false);
  const [coachProfileMessage, setCoachProfileMessage] = useState("");

  // Questions personnalisées de l'entraîneur
  const [coachQuestions, setCoachQuestions] = useState([]);
  const [loadingCoachQuestions, setLoadingCoachQuestions] = useState(false);
  const [newCoachQuestion, setNewCoachQuestion] = useState("");
  const [newCoachQuestionType, setNewCoachQuestionType] = useState("text");
  const [savingCoachQuestion, setSavingCoachQuestion] = useState(false);
  const [coachQuestionMessage, setCoachQuestionMessage] = useState("");

  // Bilan détaillé et réponses aux questions
  const [competitionQuestions, setCompetitionQuestions] = useState([]);
  const [competitionQuestionAnswers, setCompetitionQuestionAnswers] = useState({});
  const [competitionReviewId, setCompetitionReviewId] = useState(null);
  const [selectedAthleteReviews, setSelectedAthleteReviews] = useState([]);
  const [selectedAthleteAnswers, setSelectedAthleteAnswers] = useState([]);

  // =====================================================
// CHARGER LES OBJECTIFS DE L'ATHLÈTE SÉLECTIONNÉ
// =====================================================

const loadSelectedAthleteObjectives = async (athleteId) => {
  if (!athleteId) {
    setSelectedAthleteObjectives(null);
    return;
  }

  try {
    const { data, error } = await supabase
      .from("athlete_objectives")
      .select(
        "main_objective, progress_objectives, things_to_improve, coach_feedback"
      )
      .eq("athlete_id", athleteId)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur chargement objectifs de l'athlète :",
        error
      );
      setSelectedAthleteObjectives(null);
      return;
    }

    setSelectedAthleteObjectives(data || null);
    setCoachObjectiveFeedback(data?.coach_feedback || "");
    setCoachObjectiveFeedbackMessage("");
  } catch (error) {
    console.error(
      "Erreur chargement objectifs de l'athlète :",
      error
    );
    setSelectedAthleteObjectives(null);
  }
};

// =====================================================
// RETOUR DE L'ENTRAÎNEUR SUR LES OBJECTIFS
// =====================================================

const saveCoachObjectiveFeedback = async () => {
  if (!selectedCoachAthlete?.user_id) {
    setCoachObjectiveFeedbackMessage(
      "Erreur : aucun athlète sélectionné."
    );
    return;
  }

  setSavingCoachObjectiveFeedback(true);
  setCoachObjectiveFeedbackMessage("");

  try {
    const feedback = coachObjectiveFeedback.trim();

    const { error } = await supabase.rpc(
      "set_coach_objective_feedback_v2",
      {
        p_athlete_id: selectedCoachAthlete.user_id,
        p_feedback: feedback,
      }
    );

    if (error) {
      console.error(
        "Erreur sauvegarde du retour entraîneur :",
        error
      );

      setCoachObjectiveFeedbackMessage(
        "Erreur lors de l'enregistrement du retour."
      );
      return;
    }

    // Mise à jour immédiate de l'affichage
    setSelectedAthleteObjectives((previous) => ({
      ...(previous || {}),
      coach_feedback: feedback,
    }));

    setCoachObjectiveFeedback(feedback);

    setCoachObjectiveFeedbackMessage(
      "Ton retour a bien été enregistré."
    );

    setTimeout(() => {
      setCoachObjectiveFeedbackMessage("");
    }, 3000);
  } catch (error) {
    console.error(
      "Erreur sauvegarde du retour entraîneur :",
      error
    );

    setCoachObjectiveFeedbackMessage(
      "Erreur lors de l'enregistrement du retour."
    );
  } finally {
    setSavingCoachObjectiveFeedback(false);
  }
};

  // =====================================================
  // INVITATION COACH → ATHLÈTE
  // =====================================================

  const [coachInvitationCode, setCoachInvitationCode] =
    useState("");

  const [loadingInvitationCode, setLoadingInvitationCode] =
    useState(false);

  const [invitationMessage, setInvitationMessage] =
    useState("");

  const [athleteInvitationCode, setAthleteInvitationCode] =
    useState("");

  const [joiningCoach, setJoiningCoach] =
    useState(false);

  const [myCoachConnections, setMyCoachConnections] =
    useState([]);

  const [loadingCoachConnections, setLoadingCoachConnections] =
    useState(false);

  // =====================================================
  // COMPTE
  // =====================================================

  const [deletingAccount, setDeletingAccount] =
    useState(false);

  // =====================================================
  // INITIALISATION
  // =====================================================

  useEffect(() => {
    initializeApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setUser(session?.user || null);
          setMode("reset-password");
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
  if (user?.id && profile?.role === "athlete") {
    loadAthleteObjectives();
  }
}, [user?.id, profile?.role]);

  // =====================================================
  // INITIALISER L'APPLICATION
  // =====================================================

  async function initializeApp() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setMode("home");
        return;
      }

      setUser(session.user);

      let loadedProfile = await loadProfile(
        session.user.id
      );

      // Compatibilité avec les anciens comptes : si Auth existe mais que
      // profiles est absent, on recrée automatiquement la ligne minimale.
      if (!loadedProfile) {
        const { data: repairedProfile } = await supabase
          .from("profiles")
          .upsert(
            {
              id: session.user.id,
              email: session.user.email || null,
              role: session.user.user_metadata?.role || "athlete",
            },
            { onConflict: "id" }
          )
          .select("*")
          .single();
        loadedProfile = repairedProfile || null;
      }

      if (loadedProfile) {
        setProfile(loadedProfile);

        if (loadedProfile.role === "coach") {
          setCoachFirstName(loadedProfile.first_name || "");
          setCoachLastName(loadedProfile.last_name || "");
          setCoachTab("overview");
        }

        if (loadedProfile.role === "athlete") {
          await loadAthleteData(session.user.id);
          await loadCompetitions(session.user.id);
          await loadCoachConnections(session.user.id);

          setMode("dashboard");
        }

        if (loadedProfile.role === "coach") {
          await loadCoachAthletes(session.user.id);
          await loadCoachQuestions(session.user.id);
          await loadMyCoachInvitationCode();

          setMode("dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Erreur lors du chargement de l'application."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // PROFIL
  // =====================================================

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur profil :", error);
      return null;
    }

    return data;
  }

  async function saveCoachProfile(event) {
    event.preventDefault();
    if (!user) return;

    const first = coachFirstName.trim();
    const last = coachLastName.trim();

    if (!first || !last) {
      setCoachProfileMessage("Merci de renseigner ton prénom et ton nom.");
      return;
    }

    setSavingCoachProfile(true);
    setCoachProfileMessage("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ first_name: first, last_name: last })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) throw error;
      setProfile(data);
      setCoachFirstName(data.first_name || first);
      setCoachLastName(data.last_name || last);
      setCoachProfileMessage("Identité enregistrée.");
    } catch (error) {
      console.error(error);
      setCoachProfileMessage(`Erreur : ${error?.message || "Impossible d'enregistrer ton identité."}`);
    } finally {
      setSavingCoachProfile(false);
    }
  }

  async function loadCoachQuestions(coachId) {
    if (!coachId) return;
    setLoadingCoachQuestions(true);
    try {
      const { data, error } = await supabase
        .from("competition_questions")
        .select("*")
        .eq("coach_id", coachId)
        .eq("question_scope", "competition")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      setCoachQuestions(data || []);
    } catch (error) {
      console.error("Erreur chargement questions :", error);
      setCoachQuestionMessage(`Erreur : ${error?.message || "Impossible de charger les questions."}`);
    } finally {
      setLoadingCoachQuestions(false);
    }
  }

  async function saveCoachQuestion(event) {
    event.preventDefault();
    if (!user) return;
    const question = newCoachQuestion.trim();
    if (!question) {
      setCoachQuestionMessage("Écris une question avant de l'ajouter.");
      return;
    }
    setSavingCoachQuestion(true);
    setCoachQuestionMessage("");
    try {
      const nextPosition = coachQuestions.length
        ? Math.max(...coachQuestions.map((item) => Number(item.position) || 0)) + 1
        : 0;
      const { error } = await supabase
        .from("competition_questions")
        .insert({
          coach_id: user.id,
          question,
          question_type: newCoachQuestionType,
          position: nextPosition,
          active: true,
          question_scope: "competition",
        });
      if (error) throw error;
      setNewCoachQuestion("");
      setNewCoachQuestionType("text");
      await loadCoachQuestions(user.id);
      setCoachQuestionMessage("Question ajoutée. Elle apparaîtra dans les bilans de compétition.");
    } catch (error) {
      console.error("Erreur ajout question :", error);
      setCoachQuestionMessage(`Erreur : ${error?.message || "Impossible d'ajouter la question."}`);
    } finally {
      setSavingCoachQuestion(false);
    }
  }

  async function toggleCoachQuestion(question) {
    if (!user || !question?.id) return;
    try {
      const { error } = await supabase
        .from("competition_questions")
        .update({ active: !question.active })
        .eq("id", question.id)
        .eq("coach_id", user.id);
      if (error) throw error;
      await loadCoachQuestions(user.id);
    } catch (error) {
      console.error(error);
      setCoachQuestionMessage(`Erreur : ${error?.message || "Impossible de modifier la question."}`);
    }
  }

  async function deleteCoachQuestion(question) {
    if (!user || !question?.id) return;
    if (!window.confirm("Supprimer cette question ? Les réponses déjà enregistrées resteront conservées.")) return;
    try {
      const { error } = await supabase
        .from("competition_questions")
        .delete()
        .eq("id", question.id)
        .eq("coach_id", user.id);
      if (error) throw error;
      await loadCoachQuestions(user.id);
    } catch (error) {
      console.error(error);
      setCoachQuestionMessage(`Erreur : ${error?.message || "Impossible de supprimer la question."}`);
    }
  }

  // =====================================================
  // AUTHENTIFICATION
  // =====================================================

  async function handleAuth(event) {
    event.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage(
        "Merci de renseigner ton adresse e-mail et ton mot de passe."
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const {
  data,
  error,
} = await supabase.auth.signUp({
  email: email.trim(),
  password,
  options: {
    data: {
      role: role || "athlete",
      first_name:
        role === "coach"
          ? coachFirstName.trim()
          : null,
      last_name:
        role === "coach"
          ? coachLastName.trim()
          : null,
    },
  },
});
        if (error) {
          throw error;
        }

        if (!data.user) {
          throw new Error(
            "Le compte n'a pas pu être créé."
          );
        }

        const { error: profileError } =
  await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: email.trim(),
      role: role || "athlete",
      first_name:
        role === "coach"
          ? coachFirstName.trim()
          : null,
      last_name:
        role === "coach"
          ? coachLastName.trim()
          : null,
    },
    {
      onConflict: "id",
    }
  );

        if (profileError) {
          console.error(profileError);
          throw new Error(
            "Le compte a été créé mais le profil n'a pas pu être enregistré."
          );
        }

        setUser(data.user);
        setRole(role || data.user.user_metadata?.role || "athlete");

        const newProfile = {
  id: data.user.id,
  email: email.trim(),
  role: role || "athlete",
  first_name:
    role === "coach"
      ? coachFirstName.trim()
      : null,
  last_name:
    role === "coach"
      ? coachLastName.trim()
      : null,
};

        setProfile(newProfile);

        if (role === "coach") {
  setCoachTab("overview");
  setMode("dashboard");
} else {
          setAthleteProfileTab("profile");
          setMode("dashboard");
        }

        setMessage(
          "Compte créé avec succès."
        );
      } else {
        const {
          data,
          error,
        } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        if (!data.user) {
          throw new Error(
            "Connexion impossible."
          );
        }

        setUser(data.user);

        let loadedProfile =
          await loadProfile(data.user.id);

        // Un ancien compte peut exister dans Auth sans ligne profiles.
        // On recrée alors automatiquement son profil minimal afin de ne
        // jamais bloquer la connexion.
        if (!loadedProfile) {
          const fallbackRole =
            role ||
            data.user.user_metadata?.role ||
            "athlete";
          const { data: createdProfile, error: createProfileError } =
            await supabase
              .from("profiles")
              .upsert(
                {
                  id: data.user.id,
                  email: data.user.email || email.trim(),
                  role: fallbackRole,
                },
                { onConflict: "id" }
              )
              .select("*")
              .single();

          if (createProfileError) {
            throw new Error(
              `Connexion réussie, mais impossible de créer le profil : ${createProfileError.message}`
            );
          }

          loadedProfile = createdProfile;
        }

        setProfile(loadedProfile);
        setRole(loadedProfile.role || role || "athlete");

        if (
          loadedProfile.role ===
          "athlete"
        ) {
          await loadAthleteData(
            data.user.id
          );

          await loadCompetitions(
            data.user.id
          );

          await loadCoachConnections(
            data.user.id
          );
          setAthleteProfileTab("overview");

          setMode("dashboard");
        } else if (
          loadedProfile.role ===
          "coach"
        ) {
          await loadCoachAthletes(
            data.user.id
          );
          await loadCoachQuestions(data.user.id);
          await loadMyCoachInvitationCode();

          setCoachTab("overview");
          setMode("dashboard");
        }
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error?.message ||
          "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendPasswordReset(event) {
    event.preventDefault();
    const targetEmail = resetEmail.trim() || email.trim();

    if (!targetEmail) {
      setResetMessage("Renseigne ton adresse e-mail pour recevoir le lien de réinitialisation.");
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo,
      });
      if (error) throw error;

      setResetMessage("Si cette adresse correspond à un compte Season, un e-mail de réinitialisation vient d'être envoyé. Pense aussi à vérifier les spams.");
    } catch (error) {
      console.error(error);
      setResetMessage(`Erreur : ${error?.message || "Impossible d'envoyer l'e-mail de réinitialisation."}`);
    } finally {
      setResetLoading(false);
    }
  }

  async function updatePassword(event) {
    event.preventDefault();

    if (newPassword.length < 6) {
      setResetMessage("Ton nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword("");
      setConfirmNewPassword("");
      setResetMessage("Ton mot de passe a été modifié. Tu peux maintenant te connecter avec ton nouveau mot de passe.");
      setTimeout(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        setMode("login");
      }, 900);
    } catch (error) {
      console.error(error);
      setResetMessage(`Erreur : ${error?.message || "Impossible de modifier le mot de passe."}`);
    } finally {
      setResetLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setProfile(null);
    setRole(null);

    setCoachAthletes([]);
    setSelectedCoachAthlete(null);
    setSelectedAthleteCompetitions([]);
    setSelectedAthleteFeelings([]);

    setMode("home");
    setMessage("");
  }

  function chooseRole(selectedRole) {
    setRole(selectedRole);
    setMode("signup");
    setMessage("");
  }

  function backHome() {
    setMode("home");
    setMessage("");
    setEmail("");
    setPassword("");
    setResetEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetMessage("");
  }

  // =====================================================
  // ATHLÈTE
  // =====================================================

  async function loadAthleteData(userId) {
    const { data, error } = await supabase
      .from("athlete_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur chargement athlete_data :",
        error
      );
      return;
    }

    if (!data) {
      setAthleteData({
        first_name: "",
        last_name: "",
        birth_date: "",
        main_sport: "",
        main_event: "",
        club: "",
      });

      return;
    }

    const normalized = {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      birth_date: data.birth_date || "",
      main_sport: data.main_sport || "",
      main_event: data.main_event || "",
      club: data.club || "",
    };

    setAthleteData(normalized);

    setFirstName(normalized.first_name);
    setLastName(normalized.last_name);
    setBirthDate(normalized.birth_date);
    setSport(normalized.main_sport);
    setDiscipline(normalized.main_event);
    setClub(normalized.club);
  }

  async function saveAthleteProfile(event) {
    event.preventDefault();

    if (!user) return;

    setSavingProfile(true);
    setMessage("");

    try {
      const payload = {
        user_id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || null,
        main_sport: sport.trim(),
        main_event: discipline.trim(),
        club: club.trim(),
      };

      const { error: athleteDataError } = await supabase
  .from("athlete_data")
  .upsert(payload, {
    onConflict: "user_id",
  });

if (athleteDataError) {
  throw athleteDataError;
}

const { data: updatedProfile, error: profileError } = await supabase
  .from("profiles")
  .update({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
  })
  .eq("id", user.id)
  .select("id, first_name, last_name")
  .single();

if (profileError) {
  throw profileError;
}

console.log("Profil utilisateur synchronisé :", updatedProfile);

      setAthleteData({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate || "",
        main_sport: sport.trim(),
        main_event: discipline.trim(),
        club: club.trim(),
      });

      setMessage("Profil enregistré avec succès.");

setTimeout(() => {
  setMessage("");
}, 3000);
    } catch (error) {
      console.error(error);

      setMessage(
        `Erreur : ${
          error?.message ||
          "Impossible d'enregistrer le profil."
        }`
      );
    } finally {
      setSavingProfile(false);
    }
  }

  // =====================================================
  // RESSENTIS
  // =====================================================

  async function saveFeeling(event) {
    event.preventDefault();

    if (!user) return;

    setSavingFeeling(true);
    setFeelingMessage("");

    try {
      const today =
        getLocalDateString();

      const payload = {
        athlete_id: user.id,
        feeling_date: today,
        fatigue,
        motivation,
        confidence,
        physical_state: physicalState,
        pain,
        comment: feelingComment.trim() || null,
      };

      const {
        data: existing,
      } = await supabase
        .from("feelings")
        .select("id")
        .eq("athlete_id", user.id)
        .eq("feeling_date", today)
        .maybeSingle();

      let error;

      if (existing?.id) {
        const response =
          await supabase
            .from("feelings")
            .update(payload)
            .eq("id", existing.id);

        error = response.error;
      } else {
        const response =
          await supabase
            .from("feelings")
            .insert(payload);

        error = response.error;
      }

      if (error) {
        throw error;
      }

      setFeelingMessage(
        "Ton ressenti a bien été enregistré."
      );
    } catch (error) {
      console.error(error);

      setFeelingMessage(
        `Erreur : ${
          error?.message ||
          "Impossible d'enregistrer ton ressenti."
        }`
      );
    } finally {
      setSavingFeeling(false);
    }
  }

  // =====================================================
  // COMPÉTITIONS
  // =====================================================

  async function loadCompetitions(userId) {
    setLoadingCompetitions(true);

    try {
      const {
        data,
        error,
      } = await supabase
        .from("competitions")
        .select("*")
        .eq("athlete_id", userId)
        .order(
          "competition_date",
          {
            ascending: true,
          }
        );

      if (error) {
        throw error;
      }

      const list = data || [];

      setCompetitions(list);

      const today = getLocalDateString();

      const future = list
        .filter(
          (competition) =>
            competition.competition_date >=
            today
        )
        .sort(
          (a, b) =>
            new Date(
              a.competition_date
            ) -
            new Date(
              b.competition_date
            )
        );

      setNextCompetition(
        future[0] || null
      );
    } catch (error) {
      console.error(
        "Erreur compétitions :",
        error
      );
    } finally {
      setLoadingCompetitions(false);
    }
  }

  function resetCompetitionForm() {
    setShowCompetitionForm(false);
    setEditingCompetitionId(null);

    setCompetitionName("");
    setCompetitionDate("");
    setCompetitionEvent("");
    setCompetitionDistance("");
    setCompetitionLocation("");
    setCompetitionObjective("");
    setCompetitionNotes("");

    setCompetitionMessage("");
  }

  async function addCompetition(event) {
    event.preventDefault();

    if (!user) return;

    setSavingCompetition(true);
    setCompetitionMessage("");

    try {
      const existingCompetition = editingCompetitionId
        ? competitions.find(
            (competition) =>
              competition.id ===
              editingCompetitionId
          )
        : null;

      const existingReviewBlock =
        existingCompetition?.notes
          ? (
              existingCompetition.notes.match(
                /--- BILAN SEASON ---[\s\S]*$/i
              ) || []
            )[0] || ""
          : "";

      const planningNotes =
        competitionNotes
          .replace(
            /\n?--- BILAN SEASON ---[\s\S]*$/i,
            ""
          )
          .trim();

      const combinedNotes = [
        planningNotes,
        existingReviewBlock.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      const payload = {
        athlete_id: user.id,
        name: competitionName.trim(),
        competition_date: competitionDate,
        event: competitionEvent.trim() || null,
        distance: competitionDistance
          ? Number(competitionDistance)
          : null,
        location: competitionLocation.trim() || null,
        objective: competitionObjective.trim() || null,
        notes: combinedNotes || null,
      };

      let error;

      if (editingCompetitionId) {
        const response =
          await supabase
            .from("competitions")
            .update(payload)
            .eq(
              "id",
              editingCompetitionId
            )
            .eq(
              "athlete_id",
              user.id
            );

        error = response.error;
      } else {
        const response =
          await supabase
            .from("competitions")
            .insert(payload);

        error = response.error;
      }

      if (error) {
        throw error;
      }

      await loadCompetitions(
        user.id
      );

      setCompetitionMessage(
        editingCompetitionId
          ? "Compétition modifiée avec succès."
          : "Compétition ajoutée avec succès."
      );

      setShowCompetitionForm(false);
      setEditingCompetitionId(null);

      setCompetitionName("");
      setCompetitionDate("");
      setCompetitionEvent("");
      setCompetitionDistance("");
      setCompetitionLocation("");
      setCompetitionObjective("");
      setCompetitionNotes("");
    } catch (error) {
      console.error(error);

      setCompetitionMessage(
        `Erreur : ${
          error?.message ||
          "Impossible d'enregistrer la compétition."
        }`
      );
    } finally {
      setSavingCompetition(false);
    }
  }

  function startEditCompetition(
    competition
  ) {
    setEditingCompetitionId(
      competition.id
    );

    setCompetitionName(
      competition.name || ""
    );

    setCompetitionDate(
      competition.competition_date
        ? competition.competition_date.slice(
            0,
            10
          )
        : ""
    );

    setCompetitionEvent(
      competition.event || ""
    );

    setCompetitionDistance(
      competition.distance != null
        ? String(
            competition.distance
          )
        : ""
    );

    setCompetitionLocation(
      competition.location || ""
    );

    setCompetitionObjective(
      competition.objective || ""
    );

    setCompetitionNotes(
      competition.notes || ""
    );

    setCompetitionMessage("");

    setShowResultForm(false);
    setShowCompetitionForm(true);
  }

  async function deleteCompetition(
    competitionId
  ) {
    if (!user) return;

    const confirmed =
      window.confirm(
        "Supprimer cette compétition ? Cette action est définitive."
      );

    if (!confirmed) return;

    setDeletingCompetitionId(
      competitionId
    );

    try {
      const { error } =
        await supabase
          .from("competitions")
          .delete()
          .eq(
            "id",
            competitionId
          )
          .eq(
            "athlete_id",
            user.id
          );

      if (error) {
        throw error;
      }

      await loadCompetitions(
        user.id
      );
    } catch (error) {
      console.error(error);

      setCompetitionMessage(
        `Erreur : ${
          error?.message ||
          "Impossible de supprimer la compétition."
        }`
      );
    } finally {
      setDeletingCompetitionId(
        null
      );
    }
  }

  // =====================================================
  // BILAN COMPÉTITION
  // =====================================================

  function getCompetitionDayOffset(competition) {
    if (!competition?.competition_date) return null;

    const competitionDate = String(competition.competition_date).slice(0, 10);
    const todayDate = getLocalDateString();

    const competitionParts = competitionDate.split("-").map(Number);
    const todayParts = todayDate.split("-").map(Number);

    if (competitionParts.length !== 3 || todayParts.length !== 3) {
      return null;
    }

    const competitionUtc = Date.UTC(
      competitionParts[0],
      competitionParts[1] - 1,
      competitionParts[2]
    );
    const todayUtc = Date.UTC(
      todayParts[0],
      todayParts[1] - 1,
      todayParts[2]
    );

    return Math.floor((todayUtc - competitionUtc) / 86400000);
  }

  // Fenêtre exacte : jour J inclus jusqu'à J+7 inclus.
  // Exemple : compétition le 20/08/2026 → bilan du 20/08 au 27/08 inclus.
  function isCompetitionReviewAvailable(competition) {
    const offset = getCompetitionDayOffset(competition);
    return offset !== null && offset >= 0 && offset <= 7;
  }

  function getCompetitionReviewDeadline(competition) {
    if (!competition?.competition_date) return null;

    const date = String(competition.competition_date).slice(0, 10);
    const [year, month, day] = date.split("-").map(Number);
    const deadline = new Date(year, month - 1, day + 7, 12, 0, 0);

    return deadline.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function isCompetitionToday(competition) {
    return getCompetitionDayOffset(competition) === 0;
  }

  function hasCompetitionResult(competition) {
    return Boolean(competition?.result || competition?.time_result || getResultComment(competition));
  }

  function getResultComment(competition) {
    if (!competition) return "";
    if (competition.result_comment) return competition.result_comment;
    const notes = competition.notes || "";
    const markerIndex = notes.indexOf("--- BILAN SEASON ---");
    if (markerIndex === -1) return "";
    const block = notes.slice(markerIndex);
    const match = block.match(/Commentaire\s*:\s*(.*?)(?:\n|$)/i);
    return match?.[1]?.trim() || "";
  }

  async function startCompetitionResult(
    competition
  ) {
    if (!isCompetitionReviewAvailable(competition)) {
      setResultMessage(
        `Le bilan est disponible du jour J jusqu'au ${getCompetitionReviewDeadline(competition)} inclus.`
      );

      return;
    }

    setSelectedCompetitionForResult(
      competition
    );

    setCompetitionResult(
      competition.result || ""
    );

    setCompetitionTimeResult(
      competition.time_result || ""
    );

    setCompetitionResultComment(
      getResultComment(
        competition
      )
    );

    setCompetitionReviewId(null);
    setCompetitionQuestionAnswers({});

    try {
      if (user) {
        const { data: connections } = await supabase
          .from("coach_connections")
          .select("coach_id")
          .eq("athlete_id", user.id)
          .eq("status", "accepted");
        const coachIds = (connections || []).map((item) => item.coach_id);

        if (coachIds.length) {
          const { data: questions, error: questionsError } = await supabase
            .from("competition_questions")
            .select("*")
            .in("coach_id", coachIds)
            .eq("question_scope", "competition")
            .eq("active", true)
            .order("position", { ascending: true });
          if (questionsError) throw questionsError;
          setCompetitionQuestions(questions || []);
        } else {
          setCompetitionQuestions([]);
        }

        const { data: review, error: reviewError } = await supabase
          .from("competition_reviews")
          .select("*")
          .eq("competition_id", competition.id)
          .eq("athlete_id", user.id)
          .maybeSingle();
        if (reviewError) throw reviewError;

        if (review) {
          setCompetitionReviewId(review.id);
          const { data: answers, error: answersError } = await supabase
            .from("competition_answers")
            .select("*")
            .eq("review_id", review.id);
          if (answersError) throw answersError;
          const answerMap = {};
          (answers || []).forEach((answer) => {
            answerMap[answer.question_id] = answer.answer_text ?? answer.answer_number ?? answer.answer_boolean ?? "";
          });
          setCompetitionQuestionAnswers(answerMap);
        }
      }
    } catch (error) {
      console.error("Erreur chargement du bilan détaillé :", error);
    }

    setResultMessage("");

    setShowCompetitionForm(false);
    setShowResultForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetResultForm() {
    setShowResultForm(false);
    setSelectedCompetitionForResult(
      null
    );

    setCompetitionResult("");
    setCompetitionTimeResult("");
    setCompetitionResultComment("");
    setCompetitionQuestions([]);
    setCompetitionQuestionAnswers({});
    setCompetitionReviewId(null);
    setResultMessage("");
  }

  async function saveCompetitionResult(
    event
  ) {
    event.preventDefault();

    if (!user) return;

    if (
      !selectedCompetitionForResult
    ) {
      return;
    }

    if (!isCompetitionReviewAvailable(selectedCompetitionForResult)) {
      setResultMessage(
        `Le bilan est disponible du jour J jusqu'au ${getCompetitionReviewDeadline(selectedCompetitionForResult)} inclus.`
      );

      return;
    }

    setSavingResult(true);
    setResultMessage("");

    try {
      const existingNotes = selectedCompetitionForResult.notes || "";
      const cleanNotes = existingNotes
        .replace(/\n?--- BILAN SEASON ---[\s\S]*$/i, "")
        .trim();
      const reviewBlock = [
        "--- BILAN SEASON ---",
        `Résultat : ${competitionResult.trim() || "Non renseigné"}`,
        `Temps : ${competitionTimeResult.trim() || "Non renseigné"}`,
        `Commentaire : ${competitionResultComment.trim() || ""}`,
      ].join("\n");

      const payload = {
        result: competitionResult.trim() || null,
        time_result: competitionTimeResult.trim() || null,
        notes: [cleanNotes, reviewBlock].filter(Boolean).join("\n\n") || null,
      };

      const { error } =
        await supabase
          .from("competitions")
          .update(payload)
          .eq(
            "id",
            selectedCompetitionForResult.id
          )
          .eq(
            "athlete_id",
            user.id
          );

      if (error) {
        throw error;
      }

      const { data: review, error: reviewError } = await supabase
        .from("competition_reviews")
        .upsert(
          {
            competition_id: selectedCompetitionForResult.id,
            athlete_id: user.id,
            competition_feeling: competitionResultComment.trim() || null,
          },
          { onConflict: "competition_id,athlete_id" }
        )
        .select("*")
        .single();

      if (reviewError) throw reviewError;

      if (review && competitionQuestions.length) {
        const answerRows = competitionQuestions
          .filter((question) => Object.prototype.hasOwnProperty.call(competitionQuestionAnswers, question.id))
          .map((question) => {
            const value = competitionQuestionAnswers[question.id];
            return {
              review_id: review.id,
              question_id: question.id,
              answer_text: question.question_type === "text" ? (String(value || "").trim() || null) : null,
              answer_number: question.question_type === "scale" ? (value === "" || value == null ? null : Number(value)) : null,
              answer_boolean: question.question_type === "yes_no" ? (value === "" || value == null ? null : Boolean(value)) : null,
            };
          });
        if (answerRows.length) {
          const { error: answersError } = await supabase
            .from("competition_answers")
            .upsert(answerRows, { onConflict: "review_id,question_id" });
          if (answersError) throw answersError;
        }
      }

      await loadCompetitions(
        user.id
      );

      setCompetitionReviewId(review?.id || null);
      setResultMessage(
        "Ton bilan a bien été enregistré."
      );

      setShowResultForm(false);
      setSelectedCompetitionForResult(
        null
      );
    } catch (error) {
      console.error(error);

      setResultMessage(
        `Erreur : ${
          error?.message ||
          "Impossible d'enregistrer ton bilan."
        }`
      );
    } finally {
      setSavingResult(false);
    }
  }

  function getCompetitionPlanningNotes(competition) {
    const notes = competition?.notes || "";
    return notes.replace(/\n?--- BILAN SEASON ---[\s\S]*$/i, "").trim();
  }

  // =====================================================
  // COACH : ATHLÈTES CONNECTÉS
  // =====================================================

  async function loadCoachAthletes(
    coachId
  ) {
    if (!coachId) return;

    setLoadingCoachAthletes(
      true
    );

    try {
      const {
        data: connections,
        error: connectionError,
      } = await supabase
        .from("coach_connections")
        .select(
          "id, coach_id, athlete_id, status, created_at, updated_at"
        )
        .eq(
          "coach_id",
          coachId
        )
        .eq(
          "status",
          "accepted"
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (connectionError) {
        throw connectionError;
      }

      if (
        !connections ||
        connections.length === 0
      ) {
        setCoachAthletes([]);
        return;
      }

      const athleteIds =
        connections.map(
          (connection) =>
            connection.athlete_id
        );

      const {
        data: profilesData,
        error: profilesError,
      } = await supabase
        .from("profiles")
        // Les noms peuvent être stockés dans profiles ou athlete_data.
        // On charge donc le profil complet pour conserver les deux cas.
        .select("*")
        .in(
          "id",
          athleteIds
        );

      if (profilesError) {
        throw profilesError;
      }

      const {
        data: athleteDataList,
        error: athleteError,
      } = await supabase
        .from("athlete_data")
        .select("*")
        .in(
          "user_id",
          athleteIds
        );

      if (athleteError) {
        throw athleteError;
      }

      const merged =
        connections.map(
          (connection) => {
            const athleteId =
              connection.athlete_id;

            const profile =
              profilesData?.find(
                (item) =>
                  item.id ===
                  athleteId
              );

            const data =
              athleteDataList?.find(
                (item) =>
                  item.id === athleteId ||
                  item.user_id === athleteId
              );

            // athlete_data est prioritaire, car il contient le profil
            // sportif. profiles sert de repli lorsque le prénom/nom y est
            // enregistré ou qu'athlete_data n'est pas encore complet.
            const firstName =
              data?.first_name ||
              profile?.first_name ||
              "";

            const lastName =
              data?.last_name ||
              profile?.last_name ||
              "";

            return {
              user_id:
                athleteId,
              email:
                profile?.email ||
                "",
              role:
                profile?.role ||
                "athlete",
              first_name:
                firstName,
              last_name:
                lastName,
              birth_date:
                data?.birth_date ||
                "",
              main_sport:
                data?.main_sport ||
                "",
              main_event:
                data?.main_event ||
                "",
              club:
                data?.club ||
                "",
              connection_id:
                connection.id,
              connection_status:
                connection.status,
            };
          }
        );

      setCoachAthletes(
        merged
      );
    } catch (error) {
      console.error(
        "Erreur chargement athlètes coach :",
        error
      );
    } finally {
      setLoadingCoachAthletes(
        false
      );
    }
  }

  async function openCoachAthlete(
    athlete
  ) {
    setSelectedCoachAthlete(
      athlete
    );

    setLoadingSelectedAthlete(
      true
    );

    try {
      const {
        data: competitionData,
        error: competitionError,
      } = await supabase
        .from("competitions")
        .select("*")
        .eq(
          "athlete_id",
          athlete.user_id
        )
        .order(
          "competition_date",
          {
            ascending: true,
          }
        );

      if (competitionError) {
        throw competitionError;
      }

      const {
        data: feelingsData,
        error: feelingsError,
      } = await supabase
        .from("feelings")
        .select("*")
        .eq(
          "athlete_id",
          athlete.user_id
        )
        .order(
          "feeling_date",
          {
            ascending: false,
          }
        );

      if (feelingsError) {
        throw feelingsError;
      }

      const { data: objectivesData, error: objectivesError } = await supabase
  .from("athlete_objectives")
  .select(
    "main_objective, progress_objectives, things_to_improve, coach_feedback"
  )
  .eq("athlete_id", athlete.user_id)
  .maybeSingle();

if (objectivesError) {
  throw objectivesError;
}

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("competition_reviews")
        .select("*")
        .eq("athlete_id", athlete.user_id)
        .order("created_at", { ascending: false });
      if (reviewsError) throw reviewsError;

      const reviewIds = (reviewsData || []).map((review) => review.id);
      let answersData = [];
      if (reviewIds.length) {
        const { data: loadedAnswers, error: answersError } = await supabase
          .from("competition_answers")
          .select("*")
          .in("review_id", reviewIds);
        if (answersError) throw answersError;
        answersData = loadedAnswers || [];
      }

      setSelectedAthleteCompetitions(
        competitionData || []
      );

      setSelectedAthleteFeelings(
        feelingsData || []
      );

      setSelectedAthleteObjectives(objectivesData || null);
      setCoachObjectiveFeedback(objectivesData?.coach_feedback || ""
      );

      setSelectedAthleteReviews(reviewsData || []);
      setSelectedAthleteAnswers(answersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSelectedAthlete(
        false
      );
    }
  }

  function closeCoachAthlete() {
    setSelectedCoachAthlete(
      null
    );

    setSelectedAthleteCompetitions(
      []
    );

    setSelectedAthleteFeelings(
      []
    );
    setSelectedAthleteReviews([]);
    setSelectedAthleteAnswers([]);
  }

  async function removeCoachAthlete(athlete) {
    if (!user || !athlete?.connection_id) return;
    const name = `${athlete.first_name || ""} ${athlete.last_name || ""}`.trim() || "cet athlète";
    if (!window.confirm(`Retirer ${name} de ton groupe ?\n\nSes données Season resteront intactes.`)) return;

    try {
      const { error } = await supabase
        .from("coach_connections")
        .delete()
        .eq("id", athlete.connection_id)
        .eq("coach_id", user.id);
      if (error) throw error;
      if (selectedCoachAthlete?.user_id === athlete.user_id) closeCoachAthlete();
      await loadCoachAthletes(user.id);
    } catch (error) {
      console.error(error);
      setInvitationMessage(`Erreur : ${error?.message || "Impossible de retirer cet athlète."}`);
    }
  }

  // =====================================================
  // INVITATION COACH
  // =====================================================

  function generateRandomCode() {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    for (let i = 0; i < 8; i++) {
      result +=
        characters.charAt(
          Math.floor(
            Math.random() *
              characters.length
          )
        );
    }

    return result;
  }

  async function generateCoachInvitationCode() {
    if (!user) return;

    setLoadingInvitationCode(
      true
    );

    setInvitationMessage("");

    try {
      const code =
        generateRandomCode();

      const {
        data,
        error,
      } = await supabase
        .from(
          "coach_invitation_codes"
        )
        .insert({
          coach_id: user.id,
          code,
          used: false,
          used_by: null,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setCoachInvitationCode(
        data.code
      );

      setInvitationMessage(
        "Code d'invitation créé avec succès."
      );
    } catch (error) {
      console.error(error);

      setInvitationMessage(
        `Erreur : ${
          error?.message ||
          "Impossible de créer le code d'invitation."
        }`
      );
    } finally {
      setLoadingInvitationCode(
        false
      );
    }
  }

  async function copyInvitationCode() {
    if (!coachInvitationCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        coachInvitationCode
      );

      setInvitationMessage(
        "Code copié dans le presse-papiers."
      );
    } catch (error) {
      console.error(error);

      setInvitationMessage(
        "Impossible de copier automatiquement le code."
      );
    }
  }

  async function loadMyCoachInvitationCode() {
    if (!user) return;

    try {
      const {
        data,
        error,
      } = await supabase
        .from(
          "coach_invitation_codes"
        )
        .select("*")
        .eq(
          "coach_id",
          user.id
        )
        .eq(
          "used",
          false
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCoachInvitationCode(
          data.code
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // =====================================================
  // ATHLÈTE : REJOINDRE UN COACH
  // =====================================================

  async function joinCoachWithCode(
    event
  ) {
    event.preventDefault();

    if (!user) return;

    const cleanCode =
      athleteInvitationCode
        .trim()
        .toUpperCase();

    if (!cleanCode) {
      setInvitationMessage(
        "Entre ton code d'invitation."
      );

      return;
    }

    setJoiningCoach(true);
    setInvitationMessage("");

    try {
      const {
        data: invitation,
        error: invitationError,
      } = await supabase
        .from(
          "coach_invitation_codes"
        )
        .select("*")
        .eq(
          "code",
          cleanCode
        )
        .eq(
          "used",
          false
        )
        .maybeSingle();

      if (invitationError) {
        throw invitationError;
      }

      if (!invitation) {
        throw new Error(
          "Code invalide ou déjà utilisé."
        );
      }

      if (
        invitation.coach_id ===
        user.id
      ) {
        throw new Error(
          "Tu ne peux pas utiliser ton propre code."
        );
      }

      const {
        data: existingConnection,
        error: existingError,
      } = await supabase
        .from("coach_connections")
        .select("*")
        .eq(
          "coach_id",
          invitation.coach_id
        )
        .eq(
          "athlete_id",
          user.id
        )
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingConnection) {
        throw new Error(
          "Tu es déjà connecté à cet entraîneur."
        );
      }

      const {
        error: connectionError,
      } = await supabase
        .from("coach_connections")
        .insert({
          coach_id:
            invitation.coach_id,
          athlete_id:
            user.id,
          status:
            "accepted",
        });

      if (connectionError) {
        throw connectionError;
      }

      const {
        error: updateCodeError,
      } = await supabase
        .from(
          "coach_invitation_codes"
        )
        .update({
          used: true,
          used_by: user.id,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          invitation.id
        )
        .eq(
          "used",
          false
        );

      if (updateCodeError) {
        throw updateCodeError;
      }

      setAthleteInvitationCode("");

      setInvitationMessage(
        "Tu es maintenant connecté à ton entraîneur."
      );

      await loadCoachConnections(
        user.id
      );
    } catch (error) {
      console.error(error);

      setInvitationMessage(
        `Erreur : ${
          error?.message ||
          "Impossible de rejoindre cet entraîneur."
        }`
      );
    } finally {
      setJoiningCoach(false);
    }
  }

  async function loadCoachConnections(
    athleteId
  ) {
    if (!athleteId) return;

    setLoadingCoachConnections(
      true
    );

    try {
      const {
        data: connections,
        error,
      } = await supabase
        .from("coach_connections")
        .select("*")
        .eq(
          "athlete_id",
          athleteId
        )
        .eq(
          "status",
          "accepted"
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {
        throw error;
      }

      if (
        !connections ||
        connections.length === 0
      ) {
        setMyCoachConnections(
          []
        );
        return;
      }

      const coachIds =
        connections.map(
          (connection) =>
            connection.coach_id
        );

      const {
        data: coaches,
        error: coachError,
      } = await supabase
        .from("profiles")
        .select(
          "id, email, role, first_name, last_name"
        )
        .in(
          "id",
          coachIds
        );

      if (coachError) {
        throw coachError;
      }

      const merged =
        connections.map(
          (connection) => {
            const coach =
              coaches?.find(
                (item) =>
                  item.id ===
                  connection.coach_id
              );

            return {
              ...connection,
              coach_email:
                coach?.email ||
                "",
              coach_first_name: coach?.first_name || "",
              coach_last_name: coach?.last_name || "",
              coach_role:
                coach?.role ||
                "coach",
            };
          }
        );

      setMyCoachConnections(
        merged
      );
    } catch (error) {
      console.error(
        "Erreur connexions coach :",
        error
      );
    } finally {
      setLoadingCoachConnections(
        false
      );
    }
  }

  // =====================================================
  // SUPPRESSION COMPTE
  // =====================================================

  async function deleteAccount() {
    if (!user) return;

    const confirmed = window.confirm(
      "Supprimer définitivement ton compte Season ?\n\nCette action supprimera ton compte et tes données. Elle est irréversible."
    );

    if (!confirmed) return;

    const secondConfirmation = window.prompt(
      'Pour confirmer, écris exactement : SUPPRIMER'
    );

    if (secondConfirmation !== "SUPPRIMER") {
      setMessage("Suppression annulée.");
      return;
    }

    setDeletingAccount(true);
    setMessage("");

    try {
      // La suppression de l'utilisateur Supabase Auth doit être réalisée
      // côté serveur avec service_role. Le client ne doit jamais exposer
      // cette clé. L'Edge Function attendue est : delete-user-account.
      const { error } = await supabase.functions.invoke("delete-user-account", {
        body: { user_id: user.id },
      });

      if (error) {
        throw new Error(
          "La suppression sécurisée n'est pas disponible. Vérifie que l'Edge Function Supabase « delete-user-account » est bien déployée."
        );
      }

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      setCoachAthletes([]);
      setSelectedCoachAthlete(null);
      setSelectedAthleteCompetitions([]);
      setSelectedAthleteFeelings([]);
      setSelectedAthleteReviews([]);
      setSelectedAthleteAnswers([]);
      setMode("home");
      setMessage("Ton compte Season a été supprimé.");
    } catch (error) {
      console.error(error);
      setMessage(`Erreur : ${error?.message || "Impossible de supprimer le compte."}`);
    } finally {
      setDeletingAccount(false);
    }
  }

  // =====================================================
  // UTILITAIRES
  // =====================================================

  function getLocalDateString() {
    const date = new Date();

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "Date inconnue";
    }

    const date = new Date(
      `${dateString.slice(
        0,
        10
      )}T12:00:00`
    );

    return date.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function getGreeting() {
    const hour =
      new Date().getHours();

    if (hour < 6) {
      return "Bonne nuit";
    }

    if (hour < 12) {
      return "Bonjour";
    }

    if (hour < 18) {
      return "Bon après-midi";
    }

    return "Bonsoir";
  }

  function getInitials() {
    const first =
      athleteData.first_name
        ?.charAt(0)
        ?.toUpperCase() ||
      "";

    const last =
      athleteData.last_name
        ?.charAt(0)
        ?.toUpperCase() ||
      "";

    return (
      first + last || "A"
    );
  }

  function getCoachAthleteInitials(
    athlete
  ) {
    const first =
      athlete.first_name
        ?.charAt(0)
        ?.toUpperCase() ||
      "";

    const last =
      athlete.last_name
        ?.charAt(0)
        ?.toUpperCase() ||
      "";

    return (
      first + last || "A"
    );
  }

  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo" translate="no">SEASON</div>
          <div className="empty-state">
            <div className="loading-spinner" />
            <p>Chargement de <span translate="no">Season</span>...</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ESPACE ATHLÈTE
  // =====================================================

  if (user && profile?.role === "athlete") {
    const todayCompetitions = competitions.filter(isCompetitionToday);
    const openReviews = competitions.filter(isCompetitionReviewAvailable);
    const completedCompetitions = competitions.filter(hasCompetitionResult);
    

    return (
      <div className="dashboard">
        <header
  className="dashboard-header"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    rowGap: "8px",
    padding: "14px 20px",
  }}
>
  {/* Logo */}
  <div className="brand">
    <div className="brand-mark">S</div>
    <span translate="no">SEASON</span>
  </div>

  {/* Profil athlète en haut à droite */}
  <div
    className="header-profile"
    style={{
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: 0,
    }}
  >
    <div className="avatar">
      {getInitials()}
    </div>

    <div style={{ minWidth: 0 }}>
      <strong
        style={{
          display: "block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {`${athleteData?.first_name || ""} ${
          athleteData?.last_name || ""
        }`.trim() || "Athlète"}
      </strong>

      <small>Athlète</small>
    </div>
  </div>

  {/* Navigation athlète */}
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      flexWrap: "wrap",
      width: "100%",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid rgba(0,0,0,0.08)",
    }}
    aria-label="Navigation athlète"
  >
    {[
  ["dashboard", "Accueil"],
  ["feeling", "Ressenti"],
  ["season", "Ma saison"],
  ["objectives", "Mes objectifs"],
  ["coach", "Mon entraîneur"],
  ["profile", "Profil"],
].map(([key, label]) => (
      <button
        key={key}
        type="button"
        className={
          mode === key
            ? "primary-button"
            : "outline-button"
        }
        onClick={() => setMode(key)}
        style={{
          borderRadius: "12px",
          padding: "9px 15px",
          minHeight: "42px",
          whiteSpace: "nowrap",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        {label}
      </button>
    ))}
  </nav>
</header>

        <main className="dashboard-main">
          {mode === "dashboard" && (
            <>
              <section className="welcome-section">
                <div>
                  <p className="section-label">TON ESPACE ATHLÈTE</p>
                  <h1>{getGreeting()} {athleteData.first_name ? <span>{athleteData.first_name}</span> : null}.<br />Prêt pour ta saison ?</h1>
                  <p>Un espace pour suivre ce que les chiffres ne racontent pas : ton ressenti, tes compétitions et ton projet.</p>
                </div>
                <div className="season-badge">
                  <span>COMPÉTITIONS</span>
                  <strong>{competitions.length}</strong>
                </div>
              </section>

              {todayCompetitions.length > 0 && (
                <section className="season-list" style={{ marginBottom: "20px" }}>
                  <div className="section-heading">
                    <div>
                      <span className="card-label">AUJOURD'HUI</span>
                      <h2>Jour de compétition 🏁</h2>
                    </div>
                    <span className="small-tag">Bilan ouvert</span>
                  </div>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {todayCompetitions.map((competition) => (
                      <div key={competition.id} style={{ padding: "18px", borderRadius: "16px", background: "rgba(0,0,0,0.035)" }}>
                        <h3 style={{ marginTop: 0 }}>{competition.name}</h3>
                        <p>{competition.event || "Compétition"}{competition.location ? ` · ${competition.location}` : ""}</p>
                        {competition.objective && <span className="small-tag">🎯 {competition.objective}</span>}
                        <div style={{ marginTop: "14px" }}>
                          <button type="button" className={hasCompetitionResult(competition) ? "outline-button" : "primary-button"} onClick={() => startCompetitionResult(competition)}>
                            {hasCompetitionResult(competition) ? "✏️ Modifier mon bilan" : "📝 Faire mon bilan"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="dashboard-grid">
                <div className="feeling-card main-card">
                  <div className="card-header">
                    <div>
                      <span className="card-label">AUJOURD'HUI</span>
                      <h2 className="feeling-card-title">Comment tu te sens ?</h2>
                    </div>
                    <div className="card-icon">✦</div>
                  </div>
                  <p>Prends quelques secondes pour faire le point sur ton état physique et mental.</p>
                  <button type="button" className="card-button" onClick={() => setMode("feeling")}>Faire mon ressenti <span>→</span></button>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">🏆</div>
                  <span className="card-label">PROCHAINE ÉTAPE</span>
                  <h3>{nextCompetition?.name || "Aucune compétition programmée"}</h3>
                  <p>{nextCompetition ? formatDate(nextCompetition.competition_date) : "Ajoute une compétition pour construire ton calendrier."}</p>
                  {nextCompetition?.objective && <span className="small-tag">🎯 {nextCompetition.objective}</span>}
                </div>

                <div className="info-card">
                  <div className="info-card-icon">📊</div>
                  <span className="card-label">MA SAISON</span>
                  <h3>{completedCompetitions.length} bilan{completedCompetitions.length > 1 ? "s" : ""}</h3>
                  <p>{openReviews.length ? `${openReviews.length} compétition${openReviews.length > 1 ? "s" : ""} avec un bilan ouvert.` : "Aucun bilan ouvert actuellement."}</p>
                  <button type="button" className="outline-button" onClick={() => setMode("season")}>Voir ma saison →</button>
                </div>
              </section>
            </>
          )}

          {mode === "feeling" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <span className="section-label">MON RESSENTI</span>
                  <h1>Comment vas-tu aujourd'hui ?</h1>
                  <p>Quelques indicateurs pour donner à ton entraîneur une vision plus humaine de ta saison.</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={saveFeeling}>
                {[
                  ["Fatigue", fatigue, setFatigue],
                  ["Motivation", motivation, setMotivation],
                  ["Confiance", confidence, setConfidence],
                  ["État physique", physicalState, setPhysicalState],
                  ["Douleur", pain, setPain],
                ].map(([label, value, setter]) => (
                  <div key={label} style={{ marginBottom: "22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                      <label>{label}</label><strong>{value}/10</strong>
                    </div>
                    <input type="range" min="0" max="10" value={value} onChange={(e) => setter(Number(e.target.value))} style={{ width: "100%" }} />
                  </div>
                ))}
                <div>
                  <label>Un commentaire ?</label>
                  <textarea value={feelingComment} onChange={(e) => setFeelingComment(e.target.value)} placeholder="Ce qui va bien, ce qui te préoccupe, ce dont tu as besoin..." />
                </div>
                {feelingMessage && <div className={feelingMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{feelingMessage}</div>}
                <button type="submit" className="large-submit" disabled={savingFeeling}>{savingFeeling ? "Enregistrement..." : "Enregistrer mon ressenti →"}</button>
              </form>
            </section>
          )}

          {mode === "season" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <span className="section-label">MA SAISON</span>
                  <h1>Construis ton projet sportif.</h1>
                  <p>Tes objectifs, tes compétitions et tes bilans au même endroit.</p>
                </div>
                <button type="button" className="outline-button" onClick={() => { resetCompetitionForm(); setShowCompetitionForm(true); }}>+ Ajouter une compétition</button>
              </div>

              <div className="season-overview">
                <div className="overview-card"><span>COMPÉTITIONS</span><strong>{competitions.length}</strong><p>enregistrée{competitions.length > 1 ? "s" : ""}</p></div>
                <div className="overview-card"><span>DISCIPLINE</span><strong>{athleteData.main_event || "—"}</strong><p>{athleteData.main_sport || "Sport non renseigné"}</p></div>
                <div className="overview-card"><span>CLUB</span><strong>{athleteData.club || "—"}</strong><p>Mon environnement sportif</p></div>
              </div>

              {showCompetitionForm && (
                <form className="profile-form competition-edit-form" onSubmit={addCompetition}>
                  <span className="card-label">{editingCompetitionId ? "MODIFIER LA COMPÉTITION" : "NOUVELLE COMPÉTITION"}</span>
                  <h2>{editingCompetitionId ? "Modifier les informations" : "Ajouter une compétition"}</h2>
                  <div className="form-row">
                    <div><label>Nom de la compétition *</label><input required value={competitionName} onChange={(e) => setCompetitionName(e.target.value)} placeholder="Ex : Meeting de Rennes" /></div>
                    <div><label>Date *</label><input required type="date" value={competitionDate} onChange={(e) => setCompetitionDate(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div><label>Événement</label><input value={competitionEvent} onChange={(e) => setCompetitionEvent(e.target.value)} placeholder="Ex : 800 m" /></div>
                    <div><label>Distance (m)</label><input type="number" min="0" value={competitionDistance} onChange={(e) => setCompetitionDistance(e.target.value)} placeholder="Ex : 800" /></div>
                  </div>
                  <div className="form-row">
                    <div><label>Emplacement</label><input value={competitionLocation} onChange={(e) => setCompetitionLocation(e.target.value)} placeholder="Ex : Rennes" /></div>
                    <div><label>Objectif</label><input value={competitionObjective} onChange={(e) => setCompetitionObjective(e.target.value)} placeholder="Ex : 1'59" /></div>
                  </div>
                  <div><label>Notes de préparation</label><textarea value={competitionNotes} onChange={(e) => setCompetitionNotes(e.target.value)} placeholder="Informations supplémentaires..." /></div>
                  {competitionMessage && <div className={competitionMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{competitionMessage}</div>}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}><button className="large-submit" type="submit" disabled={savingCompetition}>{savingCompetition ? "Enregistrement..." : editingCompetitionId ? "Enregistrer les modifications" : "Ajouter la compétition"}</button><button type="button" className="logout-button" onClick={resetCompetitionForm} disabled={savingCompetition}>Annuler</button></div>
                </form>
              )}

              {showResultForm && (
                <form className="profile-form competition-result-form" onSubmit={saveCompetitionResult} style={{ marginTop: "24px", marginBottom: "24px" }}>
                  <span className="card-label">{hasCompetitionResult(selectedCompetitionForResult) ? "MODIFIER MON BILAN" : "MON BILAN DE COMPÉTITION"}</span>
                  <h2>Comment s'est passée ta compétition ?</h2>
                  <p>Disponible le jour J et pendant les 7 jours suivants, jusqu'à J+7 inclus.{selectedCompetitionForResult ? ` Date limite : ${getCompetitionReviewDeadline(selectedCompetitionForResult)}.` : ""}</p>
                  <div className="form-row">
                    <div><label>Résultat</label><input value={competitionResult} onChange={(e) => setCompetitionResult(e.target.value)} placeholder="Ex : 2e place" /></div>
                    <div><label>Temps</label><input value={competitionTimeResult} onChange={(e) => setCompetitionTimeResult(e.target.value)} placeholder="Ex : 1'59''82" /></div>
                  </div>
                  <div><label>Ton ressenti après la compétition</label><textarea value={competitionResultComment} onChange={(e) => setCompetitionResultComment(e.target.value)} placeholder="Comment tu as vécu ta course ? Ce dont tu es fier, ce que tu aurais aimé améliorer..." /></div>
                  {competitionQuestions.length > 0 && <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.08)" }}><span className="card-label">QUESTIONS DE TON ENTRAÎNEUR</span><h3>Quelques questions pour mieux comprendre ta course</h3><div style={{ display: "grid", gap: "18px" }}>{competitionQuestions.map((question) => <div key={question.id}><label>{question.question}</label>{question.question_type === "text" && <textarea value={competitionQuestionAnswers[question.id] ?? ""} onChange={(e) => setCompetitionQuestionAnswers((current) => ({ ...current, [question.id]: e.target.value }))} placeholder="Ta réponse..." />}{question.question_type === "scale" && <div style={{ display: "flex", alignItems: "center", gap: "14px" }}><input type="range" min="0" max="10" value={competitionQuestionAnswers[question.id] ?? 5} onChange={(e) => setCompetitionQuestionAnswers((current) => ({ ...current, [question.id]: Number(e.target.value) }))} style={{ flex: 1 }} /><strong>{competitionQuestionAnswers[question.id] ?? 5}/10</strong></div>}{question.question_type === "yes_no" && <div style={{ display: "flex", gap: "10px" }}><button type="button" className={competitionQuestionAnswers[question.id] === true ? "primary-button" : "outline-button"} onClick={() => setCompetitionQuestionAnswers((current) => ({ ...current, [question.id]: true }))}>Oui</button><button type="button" className={competitionQuestionAnswers[question.id] === false ? "primary-button" : "outline-button"} onClick={() => setCompetitionQuestionAnswers((current) => ({ ...current, [question.id]: false }))}>Non</button></div>}</div>)}</div></div>}
                  {resultMessage && <div className={resultMessage.startsWith("Erreur") || resultMessage.startsWith("Le bilan") ? "auth-message" : "success-message"}>{resultMessage}</div>}
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}><button className="large-submit" type="submit" disabled={savingResult}>{savingResult ? "Enregistrement..." : "Enregistrer mon bilan →"}</button><button type="button" className="logout-button" onClick={resetResultForm} disabled={savingResult}>Annuler</button></div>
                </form>
              )}

              <div className="season-list">
                <div className="section-heading"><div><span className="card-label">CALENDRIER</span><h2>Mes compétitions</h2></div><span className="small-tag">{competitions.length}</span></div>
                {loadingCompetitions ? <div className="empty-state"><div className="loading-spinner" /><p>Chargement...</p></div> : competitions.length === 0 ? <div className="empty-state large-empty"><div className="empty-icon">🏁</div><h3>Aucune compétition pour le moment.</h3><p>Ajoute ta première compétition pour commencer ton calendrier.</p><button type="button" className="outline-button" onClick={() => { resetCompetitionForm(); setShowCompetitionForm(true); }}>Ajouter ma première compétition</button></div> : <div className="competition-list">{competitions.map((competition) => { const date = competition.competition_date ? new Date(`${competition.competition_date.slice(0, 10)}T12:00:00`) : null; const hasResult = hasCompetitionResult(competition); const reviewOpen = isCompetitionReviewAvailable(competition); return <div className="competition-row" key={competition.id}><div className="competition-date"><strong>{date ? date.getDate() : "—"}</strong><span>{date ? date.toLocaleDateString("fr-FR", { month: "short" }) : ""}</span></div><div style={{ flex: 1, minWidth: 0 }}><h3>{competition.name}</h3><p>{competition.event || "Compétition"}{competition.location ? ` · ${competition.location}` : ""}</p>{competition.objective && <span className="small-tag">🎯 {competition.objective}</span>}{competition.distance && <span className="small-tag" style={{ marginLeft: "8px" }}>📏 {competition.distance} m</span>}{getCompetitionPlanningNotes(competition) && <p style={{ marginTop: "10px" }}>📝 {getCompetitionPlanningNotes(competition)}</p>}{hasResult && <div style={{ marginTop: "14px", padding: "14px", borderRadius: "12px", background: "rgba(0,0,0,0.04)" }}><strong>🏁 Bilan</strong><div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>{competition.result && <span className="small-tag">Résultat : {competition.result}</span>}{competition.time_result && <span className="small-tag">⏱️ {competition.time_result}</span>}</div>{getResultComment(competition) && <p style={{ marginTop: "10px" }}>💬 {getResultComment(competition)}</p>}</div>}</div><div style={{ minWidth: "210px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>{reviewOpen && <span style={{ fontSize: "12px", opacity: 0.68, textAlign: "center" }}>Bilan ouvert jusqu'au {getCompetitionReviewDeadline(competition)}</span>}{reviewOpen && <button type="button" className={hasResult ? "outline-button" : "primary-button"} onClick={() => startCompetitionResult(competition)}>{hasResult ? "✏️ Modifier mon bilan" : "📝 Faire mon bilan"}</button>}<button type="button" className="outline-button" onClick={() => startEditCompetition(competition)}>✏️ Modifier</button><button type="button" className="logout-button" onClick={() => deleteCompetition(competition.id)} disabled={deletingCompetitionId === competition.id}>{deletingCompetitionId === competition.id ? "Suppression..." : "Supprimer"}</button></div></div>; })}</div>}
              </div>
            </section>
          )}

          {mode === "objectives" && (
  <section className="page-section">
    {/* =====================================================
        EN-TÊTE
    ===================================================== */}

    <div className="page-heading">
      <div>
        <span className="section-label">MES OBJECTIFS</span>

        <h1>Mon projet sportif.</h1>

        <p>
          Définis ce que tu veux atteindre, les étapes pour y arriver
          et les points sur lesquels tu veux progresser.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "12px",
          background: "rgba(0,0,0,0.035)",
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        🎯 Mon projet
      </div>
    </div>

    {loadingObjectives ? (
      <div className="season-list">
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Chargement de ton projet...</p>
        </div>
      </div>
    ) : (
      <>
        {/* =====================================================
            OBJECTIF PRINCIPAL
        ===================================================== */}

        <div
          className="season-list"
          style={{
            marginBottom: "20px",
            padding: "28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              borderRadius: "0 0 0 100%",
              background: "rgba(0,0,0,0.025)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <span className="card-label">
                🎯 OBJECTIF PRINCIPAL
              </span>

              <h2 style={{ marginBottom: "6px" }}>
                Ce que je veux atteindre
              </h2>

              <p
                style={{
                  margin: 0,
                  opacity: 0.65,
                  fontSize: "14px",
                }}
              >
                Le résultat qui donne une direction à ta saison.
              </p>
            </div>

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.045)",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              🎯
            </div>
          </div>

          <textarea
  className="objectives-textarea"
  value={mainObjective}
  onChange={(e) => setMainObjective(e.target.value)}
  placeholder="Ex : Passer sous les 2 minutes au 800 m..."
  style={{
    minHeight: "110px",
    resize: "vertical",
  }}
/>
        </div>

        {/* =====================================================
            OBJECTIFS DE PROGRESSION + AXES DE TRAVAIL
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* OBJECTIFS DE PROGRESSION */}

          <div
            className="season-list"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "15px",
                marginBottom: "18px",
              }}
            >
              <div>
                <span className="card-label">
                  🚀 PROGRESSION
                </span>

                <h2 style={{ marginBottom: "6px" }}>
                  Les étapes pour progresser
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    opacity: 0.6,
                  }}
                >
                  Les éléments qui vont te rapprocher de ton objectif.
                </p>
              </div>

              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.04)",
                  flexShrink: 0,
                }}
              >
                🚀
              </div>
            </div>

            <textarea
            className="objectives-textarea"
            value={progressObjectives}
              onChange={(e) =>
                setProgressObjectives(e.target.value)
              }
              placeholder="Ex : améliorer mon départ, ma vitesse, ma régularité..."
              style={{
                minHeight: "150px",
                resize: "vertical",
              }}
            />
          </div>

          {/* AXES DE TRAVAIL */}

          <div
            className="season-list"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "15px",
                marginBottom: "18px",
              }}
            >
              <div>
                <span className="card-label">
                  💭 AXES DE TRAVAIL
                </span>

                <h2 style={{ marginBottom: "6px" }}>
                  Ce que je veux améliorer
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    opacity: 0.6,
                  }}
                >
                  Les points techniques, physiques ou mentaux à travailler.
                </p>
              </div>

              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.04)",
                  flexShrink: 0,
                }}
              >
                💭
              </div>
            </div>

            <textarea
            className="objectives-textarea"
            value={thingsToImprove}
              onChange={(e) =>
                setThingsToImprove(e.target.value)
              }
              placeholder="Ex : mieux gérer mon stress avant les compétitions..."
              style={{
                minHeight: "150px",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div
          className="season-list"
          style={{
            marginBottom: "20px",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong style={{ display: "block", marginBottom: "4px" }}>
                Ton projet évolue avec ta saison.
              </strong>

              <span
                style={{
                  fontSize: "13px",
                  opacity: 0.6,
                }}
              >
                Pense à mettre à jour tes objectifs lorsque tes priorités changent.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="primary-button"
                onClick={saveAthleteObjectives}
                disabled={savingObjectives}
              >
                {savingObjectives
                  ? "Enregistrement..."
                  : "✓ Enregistrer mes objectifs"}
              </button>

              <button
                type="button"
                className="logout-button"
                onClick={deleteAthleteObjectives}
                disabled={savingObjectives}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MESSAGE DE SAUVEGARDE
        ===================================================== */}

        {objectivesMessage && (
  <div
    className={
      objectivesMessage.startsWith("Erreur")
        ? "auth-message"
        : "success-message"
    }
    style={{
      marginTop: "16px",
      transition: "opacity 0.3s ease",
    }}
  >
    {objectivesMessage}
  </div>
)}

        {/* =====================================================
            RETOUR DE L'ENTRAÎNEUR
        ===================================================== */}

        <div
          className="season-list"
          style={{
            padding: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <span className="card-label">
                💬 RETOUR DE MON ENTRAÎNEUR
              </span>

              <h2 style={{ marginBottom: "6px" }}>
                Le regard de ton entraîneur
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  opacity: 0.6,
                }}
              >
                Un espace pour garder les échanges importants autour de ton projet.
              </p>
            </div>

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.045)",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              💬
            </div>
          </div>

          {coachFeedback ? (
            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(0,0,0,0.035)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.07)",
                    fontSize: "15px",
                  }}
                >
                  👤
                </div>

                <strong>
  {myCoachConnections?.[0]?.coach_first_name ||
  myCoachConnections?.[0]?.coach_last_name
    ? `${myCoachConnections?.[0]?.coach_first_name || ""} ${myCoachConnections?.[0]?.coach_last_name || ""}`.trim()
    : "Ton entraîneur"}
</strong>
              </div>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}
              >
                {coachFeedback}
              </p>
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                padding: "32px 20px",
              }}
            >
              <div className="empty-icon">💬</div>

              <h3>Aucun retour pour le moment.</h3>

              <p>
                Ton entraîneur pourra ajouter ici un commentaire
                sur tes objectifs et ton projet sportif.
              </p>
            </div>
          )}
        </div>
      </>
    )}
  </section>
)}

          {mode === "coach" && (
  <section className="page-section">
    <div className="page-heading">
      <div>
        <span className="section-label">MES COACHS</span>
        <h1>Tes entraîneurs connectés</h1>
        <p>
          Retrouve ici les entraîneurs avec lesquels tu es connecté.
        </p>
      </div>

      <span className="small-tag">
        {myCoachConnections.length}{" "}
        {myCoachConnections.length > 1 ? "coachs" : "coach"}
      </span>
    </div>

    {/* Rejoindre un entraîneur */}
    <div
      className="season-list"
      style={{
        marginBottom: "32px",
      }}
    >
      <div className="section-heading">
        <div>
          <span className="card-label">
            REJOINDRE UN ENTRAÎNEUR
          </span>

          <h2>Entre le code donné par ton entraîneur</h2>
        </div>
      </div>

      <form
        className="profile-form"
        onSubmit={joinCoachWithCode}
      >
        <div className="form-row">
          <div>
            <label>Code d'invitation</label>

            <input
              type="text"
              value={athleteInvitationCode}
              onChange={(e) =>
                setAthleteInvitationCode(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Ex : A7K9P2QX"
              maxLength={8}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <button
              type="submit"
              className="large-submit"
              disabled={joiningCoach}
            >
              {joiningCoach
                ? "Connexion..."
                : "Rejoindre mon coach →"}
            </button>
          </div>
        </div>

        {invitationMessage && (
          <div
            className={
              invitationMessage.startsWith("Erreur")
                ? "auth-message"
                : "success-message"
            }
            style={{ marginTop: "16px" }}
          >
            {invitationMessage}
          </div>
        )}
      </form>
    </div>

    {/* Liste des coachs */}
    <div className="season-list">
      <div className="section-heading">
        <div>
          <span className="card-label">MES COACHS</span>
          <h2>Tes entraîneurs connectés</h2>
        </div>

        <span className="small-tag">
          {myCoachConnections.length}{" "}
          {myCoachConnections.length > 1 ? "coachs" : "coach"}
        </span>
      </div>

      {loadingCoachConnections ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Chargement de tes entraîneurs...</p>
        </div>
      ) : myCoachConnections.length === 0 ? (
        <div className="empty-state large-empty">
          <div className="empty-icon">👥</div>

          <h3>Aucun entraîneur connecté.</h3>

          <p>
            Demande le code d'invitation à ton entraîneur
            pour commencer.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {myCoachConnections.map((connection) => (
            <div
              key={connection.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                padding: "18px 20px",
                border:
                  "1px solid rgba(0,0,0,0.08)",
                borderRadius: "16px",
                background: "white",
              }}
            >
              <div>
                <strong>
                  {`${connection.coach_first_name || ""} ${
                    connection.coach_last_name || ""
                  }`.trim() || "Entraîneur"}
                </strong>

                <p
                  style={{
                    margin: "5px 0 0",
                    opacity: 0.65,
                  }}
                >
                  {connection.coach_first_name ||
                  connection.coach_last_name
                    ? "Entraîneur connecté"
                    : connection.coach_email}
                </p>
              </div>

              <span className="small-tag">
                ✓ Connecté
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
)}

          {mode === "profile" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <span className="section-label">MON PROFIL</span>
                  <h1>Ton espace personnel.</h1>
                  <p>Ton identité sportive, tes coachs et ton compte réunis au même endroit.</p>
                </div>
              </div>

              {/* 1. Formulaire d'identité */}
              <div className="profile-layout" style={{ marginBottom: "32px" }}>
                <div className="profile-identity">
                  <div className="big-avatar">{getInitials()}</div>
                  <h2>{athleteData?.first_name || "Ton prénom"} {athleteData?.last_name || ""}</h2>
                  <p>{athleteData?.main_sport || "Sport non renseigné"}{athleteData?.main_event ? ` · ${athleteData.main_event}` : ""}</p>
                  {athleteData?.club && <span className="small-tag">{athleteData.club}</span>}
                  <span className="profile-role" style={{ marginTop: "10px" }}>ATHLÈTE</span>
                </div>
                <form className="profile-form" onSubmit={saveAthleteProfile}>
                  <div className="section-heading">
                    <div>
                      <span className="card-label">IDENTITÉ SPORTIVE</span>
                      <h2>Tes informations</h2>
                    </div>
                  </div>
                  <div className="form-row">
                    <div><label>Prénom</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                    <div><label>Nom</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div><label>Date de naissance</label><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
                    <div><label>Sport</label><input value={sport} onChange={(e) => setSport(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div><label>Discipline</label><input value={discipline} onChange={(e) => setDiscipline(e.target.value)} /></div>
                    <div><label>Club</label><input value={club} onChange={(e) => setClub(e.target.value)} /></div>
                  </div>
                  {message && <div className={message.startsWith("Erreur") ? "auth-message" : "success-message"}>{message}</div>}
                  <button className="large-submit" type="submit" disabled={savingProfile}>{savingProfile ? "Enregistrement..." : "Enregistrer les modifications"}</button>
                </form>
              </div>

              {/* 2. Section Compte */}
              <div className="season-list">
                <div className="section-heading">
                  <div>
                    <span className="card-label">COMPTE</span>
                    <h2>Gérer ton compte</h2>
                  </div>
                </div>
                <p>Connecté avec {profile?.email || user?.email || "ton adresse e-mail"}.</p>
                <button type="button" className="outline-button" onClick={logout}>Se déconnecter</button>
                <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                  <span className="card-label">ZONE DANGEREUSE</span>
                  <p>La suppression du compte est définitive. Une confirmation renforcée sera demandée.</p>
                  <button type="button" className="logout-button" onClick={deleteAccount} disabled={deletingAccount}>{deletingAccount ? "Suppression..." : "Supprimer mon compte"}</button>
                </div>
              </div>
            </section>
          )}
        </main>

        <footer className="dashboard-footer"><span translate="no">SEASON</span><p>Une saison. Un ressenti. Un projet commun.</p></footer>
      </div>
    );
  }

  // =====================================================
  // ESPACE ENTRAÎNEUR
  // =====================================================

  if (user && profile?.role === "coach") {
  if (selectedCoachAthlete) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="brand">
            <div className="brand-mark">S</div>
            <span translate="no">SEASON</span>
          </div>

          <div className="header-profile">
            <div className="avatar">
              {(
                (coachFirstName?.[0] || "E") +
                (coachLastName?.[0] || "")
              ).toUpperCase()}
            </div>

            <div>
              <strong>
                {`${coachFirstName || ""} ${
                  coachLastName || ""
                }`.trim() || "Entraîneur"}
              </strong>
              <small>Coach</small>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <section className="page-section">

            {/* =====================================================
                EN-TÊTE DE L'ATHLÈTE
            ===================================================== */}

            <button
              type="button"
              className="back-button"
              onClick={closeCoachAthlete}
              style={{ marginBottom: "25px" }}
            >
              ← Retour à mes athlètes
            </button>

            <div className="page-heading">
              <div>
                <span className="section-label">ATHLÈTE</span>

                <h1>
                  {selectedCoachAthlete.first_name || "Athlète"}{" "}
                  {selectedCoachAthlete.last_name || ""}
                </h1>

                <p>
                  {selectedCoachAthlete.main_sport ||
                    "Sport non renseigné"}

                  {selectedCoachAthlete.main_event
                    ? ` · ${selectedCoachAthlete.main_event}`
                    : ""}
                </p>

                {selectedCoachAthlete.club && (
                  <span className="small-tag">
                    {selectedCoachAthlete.club}
                  </span>
                )}
              </div>
            </div>

            {loadingSelectedAthlete ? (
              <div className="empty-state">
                <div className="loading-spinner" />
                <p>Chargement des données...</p>
              </div>
            ) : (
              <>
                {/* =====================================================
    OBJECTIFS DE L'ATHLÈTE
===================================================== */}

<div
  className="season-list"
  style={{ marginTop: "30px" }}
>
  <div className="section-heading">
    <div>
      <span className="card-label">PROJET</span>
      <h2>Objectifs de l'athlète</h2>
    </div>
  </div>

  {!selectedAthleteObjectives ||
  (
    !selectedAthleteObjectives.main_objective &&
    !selectedAthleteObjectives.progress_objectives &&
    !selectedAthleteObjectives.things_to_improve &&
    !selectedAthleteObjectives.coach_feedback
  ) ? (
    <div className="empty-state">
      <div className="empty-icon">🎯</div>

      <h3>Aucun objectif renseigné</h3>

      <p>
        Cet athlète n'a pas encore défini ses objectifs dans <span translate="no">Season</span>.
      </p>
    </div>
  ) : (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
        }}
      >
        {/* OBJECTIF PRINCIPAL */}

        {selectedAthleteObjectives.main_objective && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span className="card-label">
              🎯 OBJECTIF PRINCIPAL
            </span>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: "16px",
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              {selectedAthleteObjectives.main_objective}
            </p>
          </div>
        )}

        {/* PROGRESSION */}

        {selectedAthleteObjectives.progress_objectives && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span className="card-label">
              📈 PROGRESSION
            </span>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: "16px",
                lineHeight: 1.6,
              }}
            >
              {selectedAthleteObjectives.progress_objectives}
            </p>
          </div>
        )}

        {/* À AMÉLIORER */}

        {selectedAthleteObjectives.things_to_improve && (
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <span className="card-label">
              🔧 À AMÉLIORER
            </span>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: "16px",
                lineHeight: 1.6,
              }}
            >
              {selectedAthleteObjectives.things_to_improve}
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          RETOUR DE L'ENTRAÎNEUR
      ===================================================== */}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(0,0,0,0.035)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <span className="card-label">
          💬 RETOUR DE L'ENTRAÎNEUR
        </span>

        <p
          style={{
            margin: "8px 0 16px",
            opacity: 0.7,
          }}
        >
          Ajoute un retour sur les objectifs de cet athlète.
          Il pourra le consulter depuis son espace.
        </p>

        <textarea
          value={coachObjectiveFeedback}
          onChange={(e) =>
            setCoachObjectiveFeedback(e.target.value)
          }
          placeholder="Écris ton retour sur ses objectifs..."
          rows={5}
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.12)",
            background: "white",
            fontFamily: "inherit",
            fontSize: "15px",
            lineHeight: 1.5,
            outline: "none",
          }}
        />

        {coachObjectiveFeedbackMessage && (
          <div
            className={
              coachObjectiveFeedbackMessage.startsWith("Erreur")
                ? "auth-message"
                : "success-message"
            }
            style={{ marginTop: "12px" }}
          >
            {coachObjectiveFeedbackMessage}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "12px",
          }}
        >
          <button
            type="button"
            className="large-submit"
            onClick={saveCoachObjectiveFeedback}
            disabled={savingCoachObjectiveFeedback}
          >
            {savingCoachObjectiveFeedback
              ? "Enregistrement..."
              : "Enregistrer le retour →"}
          </button>
        </div>
      </div>
    </>
  )}
</div>

                {/* =====================================================
                    COMPÉTITIONS
                ===================================================== */}

                <div
                  className="season-list"
                  style={{ marginTop: "30px" }}
                >
                  <div className="section-heading">
                    <div>
                      <span className="card-label">SAISON</span>
                      <h2>Compétitions</h2>
                    </div>

                    <span className="small-tag">
                      {selectedAthleteCompetitions.length}
                    </span>
                  </div>

                  {selectedAthleteCompetitions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🏁</div>

                      <h3>Aucune compétition</h3>

                      <p>
                        Cet athlète n'a pas encore enregistré de
                        compétition.
                      </p>
                    </div>
                  ) : (
                    <div className="competition-list">
                      {selectedAthleteCompetitions.map(
                        (competition) => (
                          <div
                            className="competition-row"
                            key={competition.id}
                          >
                            <div className="competition-date">
                              <strong>
                                {competition.competition_date
                                  ? new Date(
                                      `${competition.competition_date.slice(
                                        0,
                                        10
                                      )}T12:00:00`
                                    ).getDate()
                                  : "—"}
                              </strong>

                              <span>
                                {competition.competition_date
                                  ? new Date(
                                      `${competition.competition_date.slice(
                                        0,
                                        10
                                      )}T12:00:00`
                                    ).toLocaleDateString(
                                      "fr-FR",
                                      { month: "short" }
                                    )
                                  : ""}
                              </span>
                            </div>

                            <div style={{ flex: 1 }}>
                              <h3>{competition.name}</h3>

                              <p>
                                {competition.event ||
                                  "Compétition"}

                                {competition.location
                                  ? ` · ${competition.location}`
                                  : ""}
                              </p>

                              {competition.objective && (
                                <span className="small-tag">
                                  🎯 {competition.objective}
                                </span>
                              )}

                              <div
                                style={{
                                  marginTop: "10px",
                                }}
                              >
                                {competition.result && (
                                  <span
                                    className="small-tag"
                                    style={{
                                      marginRight: "8px",
                                    }}
                                  >
                                    Résultat :{" "}
                                    {competition.result}
                                  </span>
                                )}

                                {competition.time_result && (
                                  <span className="small-tag">
                                    ⏱️{" "}
                                    {competition.time_result}
                                  </span>
                                )}

                                {!competition.result &&
                                  !competition.time_result && (
                                    <span
                                      style={{
                                        opacity: 0.65,
                                      }}
                                    >
                                      Résultat non renseigné
                                    </span>
                                  )}
                              </div>

                              {getResultComment(
                                competition
                              ) && (
                                <p
                                  style={{
                                    marginTop: "10px",
                                  }}
                                >
                                  💬{" "}
                                  {getResultComment(
                                    competition
                                  )}
                                </p>
                              )}

                              {getCompetitionPlanningNotes(
                                competition
                              ) && (
                                <p
                                  style={{
                                    marginTop: "10px",
                                  }}
                                >
                                  📝{" "}
                                  {getCompetitionPlanningNotes(
                                    competition
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* =====================================================
                    BILANS / RÉPONSES
                ===================================================== */}

                <div
                  className="season-list"
                  style={{ marginTop: "30px" }}
                >
                  <div className="section-heading">
                    <div>
                      <span className="card-label">
                        BILANS
                      </span>

                      <h2>Réponses aux questions</h2>
                    </div>

                    <span className="small-tag">
                      {selectedAthleteReviews.length}
                    </span>
                  </div>

                  {selectedAthleteReviews.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>

                      <h3>Aucun bilan détaillé</h3>

                      <p>
                        Les réponses apparaîtront ici après
                        les bilans de l'athlète.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gap: "14px",
                      }}
                    >
                      {selectedAthleteReviews.map((review) => {
                        const competition =
                          selectedAthleteCompetitions.find(
                            (item) =>
                              item.id ===
                              review.competition_id
                          );

                        const answers =
                          selectedAthleteAnswers.filter(
                            (answer) =>
                              answer.review_id === review.id
                          );

                        return (
                          <div
                            key={review.id}
                            style={{
                              padding: "18px",
                              border:
                                "1px solid rgba(0,0,0,0.08)",
                              borderRadius: "16px",
                              background: "white",
                            }}
                          >
                            <strong>
                              {competition?.name ||
                                "Compétition"}
                            </strong>

                            <p
                              style={{
                                margin:
                                  "5px 0 12px",
                                opacity: 0.65,
                              }}
                            >
                              {competition?.competition_date
                                ? formatDate(
                                    competition.competition_date
                                  )
                                : ""}
                            </p>

                            {review.competition_feeling && (
                              <p>
                                💬{" "}
                                {
                                  review.competition_feeling
                                }
                              </p>
                            )}

                            {answers.length === 0 ? (
                              <p
                                style={{
                                  opacity: 0.65,
                                }}
                              >
                                Aucune réponse
                                personnalisée.
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "grid",
                                  gap: "10px",
                                }}
                              >
                                {answers.map((answer) => {
                                  const question =
                                    coachQuestions.find(
                                      (item) =>
                                        item.id ===
                                        answer.question_id
                                    );

                                  if (!question)
                                    return null;

                                  const value =
                                    answer.answer_text ??
                                    (answer.answer_number !=
                                    null
                                      ? `${answer.answer_number}/10`
                                      : answer.answer_boolean ===
                                        true
                                      ? "Oui"
                                      : answer.answer_boolean ===
                                        false
                                      ? "Non"
                                      : "—");

                                  return (
                                    <div
                                      key={answer.id}
                                      style={{
                                        padding:
                                          "12px 14px",
                                        borderRadius:
                                          "12px",
                                        background:
                                          "rgba(0,0,0,0.035)",
                                      }}
                                    >
                                      <strong
                                        style={{
                                          display: "block",
                                          marginBottom:
                                            "5px",
                                        }}
                                      >
                                        {question.question}
                                      </strong>

                                      <span>
                                        {value}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* =====================================================
                    RESSENTIS
                ===================================================== */}

                <div
                  className="season-list"
                  style={{ marginTop: "30px" }}
                >
                  <div className="section-heading">
                    <div>
                      <span className="card-label">
                        SUIVI
                      </span>

                      <h2>Ressentis</h2>
                    </div>

                    <span className="small-tag">
                      {selectedAthleteFeelings.length}{" "}
                      entrée
                      {selectedAthleteFeelings.length > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  {selectedAthleteFeelings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">◉</div>

                      <h3>
                        Aucun ressenti enregistré
                      </h3>

                      <p>
                        Les ressentis de cet athlète
                        apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="competition-list">
                      {selectedAthleteFeelings.map(
                        (feeling) => (
                          <div
                            className="competition-row"
                            key={feeling.id}
                            style={{
                              display: "block",
                            }}
                          >
                            <strong>
                              {formatDate(
                                feeling.feeling_date
                              )}
                            </strong>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(120px, 1fr))",
                                gap: "12px",
                                marginTop: "15px",
                              }}
                            >
                              <span className="small-tag">
                                Fatigue :{" "}
                                {feeling.fatigue}/10
                              </span>

                              <span className="small-tag">
                                Motivation :{" "}
                                {feeling.motivation}/10
                              </span>

                              <span className="small-tag">
                                Confiance :{" "}
                                {feeling.confidence}/10
                              </span>

                              <span className="small-tag">
                                Physique :{" "}
                                {feeling.physical_state}/10
                              </span>

                              <span className="small-tag">
                                Douleur :{" "}
                                {feeling.pain}/10
                              </span>
                            </div>

                            {feeling.comment && (
                              <p
                                style={{
                                  marginTop: "15px",
                                }}
                              >
                                💬 {feeling.comment}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>

        <footer className="dashboard-footer">
          <span translate="no">SEASON</span>
          <p>
            Une saison. Un ressenti. Un projet commun.
          </p>
        </footer>
      </div>
    );
  }

    return (
      <div className="dashboard">
        <header
  className="dashboard-header"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  }}
>
  <div className="brand">
    <div className="brand-mark" translate="no">S</div>
    <span translate="no">SEASON</span>
  </div>

  <div
    className="header-profile"
    style={{
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}
  >
    <div className="avatar">
      {(
        (coachFirstName?.[0] || "E") +
        (coachLastName?.[0] || "")
      ).toUpperCase()}
    </div>

    <div>
      <strong>
        {`${coachFirstName || ""} ${
          coachLastName || ""
        }`.trim() || "Entraîneur"}
      </strong>

      <small>Coach</small>
    </div>
  </div>
</header>
        <main className="dashboard-main">
          <nav aria-label="Navigation entraîneur" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: "10px", marginBottom: "28px", padding: "6px", borderRadius: "18px", background: "rgba(0,0,0,0.045)" }}>{[['overview','🏠','Accueil'],['athletes','👥','Athlètes'],['questions','❓','Questions'],['connections','🔗','Connexion'],['profile','👤','Mon profil']].map(([key, icon, label]) => <button key={key} type="button" onClick={() => { setCoachTab(key); setInvitationMessage(""); setCoachProfileMessage(""); }} style={{ border: "none", borderRadius: "13px", padding: "13px 10px", cursor: "pointer", fontWeight: 700, background: coachTab === key ? "white" : "transparent", boxShadow: coachTab === key ? "0 4px 14px rgba(0,0,0,0.07)" : "none" }}><span style={{ marginRight: "6px" }}>{icon}</span>{label}</button>)}</nav>

          {coachTab === "overview" && <section className="welcome-section"><div><p className="section-label">ESPACE ENTRAÎNEUR</p><h1>Ton équipe.<br /><span>Leur saison.</span></h1><p>Une vue claire de ton groupe, de leurs ressentis et de leurs bilans.</p></div><div className="season-badge"><span>ATHLÈTES</span><strong>{coachAthletes.length}</strong></div></section>}

          {coachTab === "athletes" && <section className="season-list"><div className="section-heading"><div><span className="card-label">MON GROUPE</span><h2>Mes athlètes</h2></div><button type="button" className="outline-button" onClick={() => user && loadCoachAthletes(user.id)}>↻ Actualiser</button></div>{loadingCoachAthletes ? <div className="empty-state"><div className="loading-spinner" /><p>Chargement de tes athlètes...</p></div> : coachAthletes.length === 0 ? <div className="empty-state large-empty"><div className="empty-icon">👥</div><h3>Aucun athlète connecté.</h3><p>Génère ton code d'invitation et donne-le à tes athlètes.</p></div> : <div className="competition-list">{coachAthletes.map((athlete) => <div key={athlete.user_id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "12px", marginBottom: "14px" }}><button type="button" onClick={() => openCoachAthlete(athlete)} style={{ minWidth: 0, width: "100%", display: "flex", alignItems: "center", gap: "18px", padding: "20px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", background: "white", cursor: "pointer", textAlign: "left" }}><div className="big-avatar">{getCoachAthleteInitials(athlete)}</div><div style={{ flex: 1, minWidth: 0 }}><h3 style={{ margin: "0 0 5px" }}>{`${athlete.first_name || ""} ${athlete.last_name || ""}`.trim() || "Athlète"}</h3><p style={{ margin: "0 0 8px" }}>{athlete.main_sport || "Sport non renseigné"}{athlete.main_event ? ` · ${athlete.main_event}` : ""}</p>{athlete.club && <span className="small-tag">{athlete.club}</span>}</div><span style={{ fontSize: "28px" }}>→</span></button><button type="button" className="logout-button" onClick={() => removeCoachAthlete(athlete)} style={{ alignSelf: "center", whiteSpace: "nowrap" }}>🗑️ Retirer</button></div>)}</div>}</section>}

          {coachTab === "questions" && <section className="page-section"><div className="page-heading"><div><span className="section-label">QUESTIONS PERSONNALISÉES</span><h1>Construis tes bilans.</h1><p>Ajoute tes propres questions, choisis le format de réponse et active ou désactive chaque question.</p></div><div className="season-badge"><span>QUESTIONS ACTIVES</span><strong>{coachQuestions.filter((q) => q.active).length}</strong></div></div><div className="profile-form" style={{ marginBottom: "22px" }}><span className="card-label">PERSONNALISER LES BILANS</span><form onSubmit={saveCoachQuestion}><div><label>Question</label><textarea value={newCoachQuestion} onChange={(e) => setNewCoachQuestion(e.target.value)} placeholder="Ex : Qu'est-ce qui t'a le plus satisfait dans ta course ?" /></div><div className="form-row"><div><label>Type de réponse</label><select value={newCoachQuestionType} onChange={(e) => setNewCoachQuestionType(e.target.value)}><option value="text">Réponse libre</option><option value="scale">Échelle de 0 à 10</option><option value="yes_no">Oui / Non</option></select></div><div style={{ display: "flex", alignItems: "flex-end" }}><button className="large-submit" type="submit" disabled={savingCoachQuestion}>{savingCoachQuestion ? "Ajout..." : "Ajouter la question →"}</button></div></div></form>{coachQuestionMessage && <div className={coachQuestionMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{coachQuestionMessage}</div>}</div><div className="season-list"><div className="section-heading"><div><span className="card-label">MES QUESTIONS</span><h2>Questions du bilan de compétition</h2></div><span className="small-tag">{coachQuestions.length}</span></div>{loadingCoachQuestions ? <p>Chargement...</p> : coachQuestions.length === 0 ? <div className="empty-state"><div className="empty-icon">❓</div><h3>Aucune question personnalisée</h3><p>Ajoute tes premières questions.</p></div> : <div style={{ display: "grid", gap: "12px" }}>{coachQuestions.map((question, index) => <div key={question.id} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: "14px", alignItems: "center", padding: "18px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px", background: "white", opacity: question.active ? 1 : 0.58 }}><strong style={{ width: "30px", height: "30px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(0,0,0,0.05)" }}>{index + 1}</strong><div><strong style={{ display: "block" }}>{question.question}</strong><span className="small-tag" style={{ marginTop: "8px" }}>{question.question_type === "text" ? "Réponse libre" : question.question_type === "scale" ? "0 à 10" : "Oui / Non"}</span>{!question.active && <span className="small-tag" style={{ marginLeft: "8px" }}>Désactivée</span>}</div><div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}><button type="button" className="outline-button" onClick={() => toggleCoachQuestion(question)}>{question.active ? "Désactiver" : "Activer"}</button><button
  type="button"
  className="logout-button"
  onClick={() => deleteCoachQuestion(question)}
  style={{
    whiteSpace: "nowrap",
  }}
>
  🗑️ Supprimer
</button></div></div>)}</div>}</div></section>}

          {coachTab === "connections" && <section className="season-list"><div className="section-heading"><div><span className="card-label">CONNEXION</span><h2>Inviter un athlète</h2></div></div><div className="profile-form"><p>Génère un code et donne-le à ton athlète. Il pourra le saisir depuis son espace <span translate="no">Season</span>.</p>{coachInvitationCode ? <div style={{ marginTop: "20px", padding: "25px", borderRadius: "18px", background: "rgba(0,0,0,0.04)", textAlign: "center" }}><span className="card-label">TON CODE D'INVITATION</span><div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "6px", margin: "15px 0" }}>{coachInvitationCode}</div><div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}><button type="button" className="primary-button" onClick={copyInvitationCode}>📋 Copier le code</button><button type="button" className="outline-button" onClick={generateCoachInvitationCode} disabled={loadingInvitationCode}>+ Nouveau code</button></div><p style={{ marginTop: "15px", fontSize: "14px", opacity: 0.65 }}>Un code devient inutilisable lorsqu'un athlète l'utilise.</p></div> : <button type="button" className="large-submit" onClick={generateCoachInvitationCode} disabled={loadingInvitationCode}>{loadingInvitationCode ? "Génération..." : "Générer mon code d'invitation →"}</button>}{invitationMessage && <div className={invitationMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{invitationMessage}</div>}</div></section>}

          {coachTab === "profile" && <section className="page-section"><div className="page-heading"><div><span className="section-label">MON PROFIL</span><h1>Ton identité d'entraîneur.</h1><p>Ton prénom et ton nom sont affichés à tes athlètes.</p></div></div><div className="profile-layout"><div className="profile-identity"><div className="big-avatar">{((coachFirstName?.[0] || "E") + (coachLastName?.[0] || "")).toUpperCase()}</div><h2>{`${coachFirstName || ""} ${coachLastName || ""}`.trim() || "Ton nom"}</h2><p>Entraîneur</p><span className="profile-role">COACH</span></div><form className="profile-form" onSubmit={saveCoachProfile}><div className="form-row"><div><label>Prénom</label><input value={coachFirstName} onChange={(e) => setCoachFirstName(e.target.value)} placeholder="Prénom" /></div><div><label>Nom</label><input value={coachLastName} onChange={(e) => setCoachLastName(e.target.value)} placeholder="Nom" /></div></div>{coachProfileMessage && <div className={coachProfileMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{coachProfileMessage}</div>}<button className="large-submit" type="submit" disabled={savingCoachProfile}>{savingCoachProfile ? "Enregistrement..." : "Enregistrer mon identité"}</button></form></div><div className="season-list" style={{ marginTop: "24px" }}><div className="section-heading"><div><span className="card-label">COMPTE</span><h2>Gérer ton compte</h2></div></div><p>Connecté avec {profile?.email || user?.email || "ton adresse e-mail"}.</p><button type="button" className="outline-button" onClick={logout}>Se déconnecter</button><div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.1)" }}><span className="card-label">ZONE DANGEREUSE</span><p>La suppression du compte est définitive. Une confirmation renforcée sera demandée.</p><button type="button" className="logout-button" onClick={deleteAccount} disabled={deletingAccount}>{deletingAccount ? "Suppression..." : "Supprimer mon compte"}</button></div></div></section>}
        </main>
        <footer className="dashboard-footer"><span translate="no">SEASON</span><p>Une saison. Un ressenti. Un projet commun.</p></footer>
      </div>
    );
  }

  // =====================================================
  // PAGE D'ACCUEIL
  // =====================================================

  if (mode === "home") {
    return (
      <div className="landing-page">
        <header className="landing-header"><div className="brand"><div className="brand-mark" translate="no">S</div><span translate="no">SEASON</span></div><button type="button" className="login-button" onClick={() => { setMode("login"); setMessage(""); }}>Se connecter</button></header>
        <main className="landing-hero"><div className="landing-content"><span className="landing-label">L'ESPACE QUI DONNE UNE VOIX À TA SAISON</span><h1>Une saison.<br /><span className="landing-accent">Un ressenti.</span><br />Un projet commun.</h1><p><span translate="no">Season</span> permet aux athlètes et aux entraîneurs de mieux communiquer, suivre les ressentis et construire ensemble une saison sportive.</p><div className="landing-buttons"><button type="button" className="primary-button" onClick={() => chooseRole("athlete")}>Je suis athlète <span>→</span></button><button type="button" className="secondary-button" onClick={() => chooseRole("coach")}>Je suis entraîneur</button></div></div><div className="landing-visual"><div className="floating-card card-one"><span>AUJOURD'HUI</span><strong>Comment tu te sens ?</strong><div className="emoji-row"><span>😄</span><span>🙂</span><span>😐</span><span>😕</span></div></div><div className="floating-card card-two"><span>SAISON 2026</span><strong>800 m</strong><small>Ton projet. Ton rythme.</small></div><div className="visual-circle"><span>S</span></div></div></main><footer className="landing-footer"><span>SEASON</span><p>Une saison. Un ressenti. Un projet commun.</p></footer>
      </div>
    );
  }

  // =====================================================
  // AUTHENTIFICATION
  // =====================================================

  if (mode === "forgot") {
    return (
      <div className="auth-page"><div className="auth-card"><button type="button" className="back-button" onClick={() => { setMode("login"); setResetMessage(""); }}>← Retour à la connexion</button><div className="auth-logo" translate="no">SEASON</div><p className="eyebrow">RÉCUPÉRATION DU COMPTE</p><h1>Mot de passe oublié ?</h1><p>Entre ton adresse e-mail et <span translate="no">Season</span> t'enverra un lien pour choisir un nouveau mot de passe.</p><form onSubmit={sendPasswordReset}><label>Adresse e-mail</label><input type="email" value={resetEmail || email} onChange={(e) => { setResetEmail(e.target.value); setEmail(e.target.value); }} placeholder="ton@email.com" required /><button className="primary-button auth-submit" type="submit" disabled={resetLoading}>{resetLoading ? "Envoi..." : "Envoyer le lien →"}</button></form>{resetMessage && <div className={resetMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{resetMessage}</div>}<div className="auth-switch">Tu te souviens de ton mot de passe ? <button type="button" onClick={() => { setMode("login"); setResetMessage(""); }}>Se connecter</button></div></div></div>
    );
  }

  if (mode === "reset-password") {
    return (
      <div className="auth-page"><div className="auth-card"><div className="auth-logo" translate="no">SEASON</div><p className="eyebrow">NOUVEAU MOT DE PASSE</p><h1>Choisis ton nouveau mot de passe.</h1><form onSubmit={updatePassword}><label>Nouveau mot de passe</label><input type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Au moins 6 caractères" required /><label>Confirmer le mot de passe</label><input type="password" minLength={6} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Répète ton mot de passe" required /><button className="primary-button auth-submit" type="submit" disabled={resetLoading}>{resetLoading ? "Modification..." : "Modifier mon mot de passe →"}</button></form>{resetMessage && <div className={resetMessage.startsWith("Erreur") ? "auth-message" : "success-message"}>{resetMessage}</div>}</div></div>
    );
  }

  return (
    <div className="auth-page"><div className="auth-card"><button type="button" className="back-button" onClick={backHome}>← Retour</button><div className="auth-logo" translate="no">SEASON</div><p className="eyebrow">{mode === "signup" ? "CRÉER UN COMPTE" : "BIENVENUE"}</p><h1>{mode === "signup" ? "Créer ton compte." : "Content de te revoir."}</h1>{mode === "signup" && role && <div className="role-badge">{role === "athlete" ? "Compte Athlète" : "Compte Entraîneur"}</div>}<form onSubmit={handleAuth}>
  {mode === "signup" && role === "coach" && (
    <>
      <label>Prénom</label>
      <input
        type="text"
        placeholder="Ton prénom"
        value={coachFirstName}
        onChange={(e) => setCoachFirstName(e.target.value)}
        autoComplete="given-name"
        required
      />

      <label>Nom</label>
      <input
        type="text"
        placeholder="Ton nom"
        value={coachLastName}
        onChange={(e) => setCoachLastName(e.target.value)}
        autoComplete="family-name"
        required
      />
    </>
  )}

  <label>Adresse e-mail</label>
  <input
    type="email"
    placeholder="ton@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    autoComplete="email"
    required
  />

  <label>Mot de passe</label>
  <input
    type="password"
    placeholder="Ton mot de passe"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="new-password"
    required
  />

  <button
    className="primary-button auth-submit"
    type="submit"
    disabled={loading}
  >
    {loading
      ? "Chargement..."
      : mode === "signup"
      ? "Créer mon compte"
      : "Se connecter"}
  </button>
</form>{mode === "login" && <button type="button" className="outline-button" style={{ width: "100%", marginTop: "12px" }} onClick={() => { setResetEmail(email); setResetMessage(""); setMode("forgot"); }}>Mot de passe oublié ?</button>}{message && <div className={message.startsWith("Erreur") ? "auth-message" : "success-message"}>{message}</div>}<div className="auth-switch">{mode === "signup" ? <>Tu as déjà un compte ? <button type="button" onClick={() => { setMode("login"); setMessage(""); }}>Se connecter</button></> : <>Tu n'as pas encore de compte ? <button type="button" onClick={() => { setMode("signup"); setMessage(""); }}>Créer un compte</button></>}</div></div></div>
  );
}

export default App;