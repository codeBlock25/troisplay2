import { choices, Games, notificationHintType } from "../../typescript/enum";
import { ActionType } from "../../typescript/interface";

export interface initReducerType {
  notification: {
    notifications: {
      message: string;
      time: Date;
      type: notificationHintType;
      hasNew: boolean;
    }[];
    userID: string;
    date: Date;
  };
  luckyGames: {
    date: Date;
    gameDetail: string;
    gameID: Games;
    gameMemberCount: number;
    gameType: Games;
    members: string[];
    playCount: number;
    price_in_coin: number;
    price_in_value: number;
    _id: string;
  }[];
  spin_details: {
    currentTime: Date;
    gameTime: Date;
    isPlayable: boolean;
  };
  roomGames: {
    _id: string;
    room_name: string;
    date: Date;
    last_changed: Date;
    entry_price: number;
    key_time: number;
    player_limit: number;
    addedBy: string;
    activeMember: number;
    players: [string];
  }[];
  my_games: {
    date: Date;
    gameDetail: string;
    gameID: Games;
    gameMemberCount: number;
    gameType: Games;
    members: string[];
    playCount: number;
    price_in_coin: number;
    price_in_value: number;
    _id: string;
    battleScore: {
      player1: {
        endDate: Date;
        title: string;
        description: string;
        answer: string;
        endGameTime: Date;
        choice: choices;
        correct_answer: string;
      };
      player2?: {
        answer: string;
        waiting: boolean;
        correct_answer: string;
      };
    };
  }[];
  playerRecord: {
    player: {
      userID: string;
      full_name: string;
      phone_number: string;
      playerpic: string;
      playername: string;
      email: string;
      location: string;
    };
    deviceSetup: {
      userID: string;
      isDarkMode: boolean;
      remember: boolean;
      online_status: boolean;
      email_notification: boolean;
      app_notification: boolean;
      mobile_notification: boolean;
    };
    referal: {
      userID: string;
      activeReferal: number;
      inactiveReferal: number;
      refer_code: string;
    };
    wallet: {
      userID: string;
      currentCoin: number;
      pendingCoin: number;
    };
    gamerecord: {
      userID: string;
      date_mark: Date;
      game: Games;
      won: string;
      earnings: number;
    }[];
    cashwallet: {
      userID: string;
      currentCash: number;
      pendingCash: number;
    };
  };
  gameDefaults: {
    commission_roshambo: {
      value: number;
      value_in: "$" | "%" | "c";
    };
    commission_penalty: {
      value: number;
      value_in: "$" | "%" | "c";
    };
    commission_guess_mater: {
      value: number;
      value_in: "$" | "%" | "c";
    };
    commission_custom_game: {
      value: number;
      value_in: "$" | "%" | "c";
    };
    cashRating: number;
    min_stack_roshambo: number;
    min_stack_penalty: number;
    min_stack_guess_master: number;
    min_stack_custom: number;
    referRating: number;
  };
}

const initialState: initReducerType = {
  notification: {
    notifications: [],
    userID: "",
    date: new Date(),
  },
  luckyGames: [],
  spin_details: {
    currentTime: new Date(),
    gameTime: new Date(),
    isPlayable: true,
  },
  roomGames: [],
  my_games: [],
  playerRecord: {
    player: {
      userID: "",
      full_name: "",
      phone_number: "",
      playerpic: "",
      playername: "",
      email: "",
      location: "",
    },
    deviceSetup: {
      userID: "",
      isDarkMode: false,
      remember: false,
      online_status: false,
      email_notification: false,
      app_notification: false,
      mobile_notification: false,
    },
    referal: {
      userID: "",
      activeReferal: 10,
      inactiveReferal: 10,
      refer_code: "",
    },
    wallet: {
      userID: "",
      currentCoin: 10,
      pendingCoin: 10,
    },
    gamerecord: [],
    cashwallet: {
      userID: "",
      currentCash: 10,
      pendingCash: 10,
    },
  },
  gameDefaults: {
    commission_roshambo: {
      value: 10,
      value_in: "%",
    },
    commission_penalty: {
      value: 10,
      value_in: "%",
    },
    commission_guess_mater: {
      value: 10,
      value_in: "%",
    },
    commission_custom_game: {
      value: 10,
      value_in: "%",
    },
    cashRating: 10,
    min_stack_roshambo: 10,
    min_stack_penalty: 10,
    min_stack_guess_master: 10,
    min_stack_custom: 10,
    referRating: 10,
  },
};

const InitialReducer = (
  state = initialState,
  action: ActionType
): initReducerType => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        luckyGames: action.payload.luckyGames,
        roomGames: action.payload.roomGames,
        my_games: action.payload.my_games,
        gameDefaults: action.payload.gameDefaults,
        playerRecord: action.payload.playerRecord,
        spin_details: action.payload.spin_details,
        notification: action.payload.notifications,
      };
    case "PLAYED":
      return {
        ...state,
        my_games: [action.payload, ...state.my_games],
      };
    default:
      return {
        ...state,
      };
  }
};

export default InitialReducer;
