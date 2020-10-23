import { AxiosResponse } from 'axios';
import { useFlutterwave } from 'flutterwave-react-v3';
import React, { useState } from 'react';
import { useQueryCache } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';
import { config } from '../constant';
import { setAction} from '../store/action';
import { Games, ReasonType } from '../typescript/enum';
import { reducerType } from '../typescript/interface';

export default function AccountF() {
    const dispatch = useDispatch()
    const [fundTp, setFund] = useState<number>(0)
    const { action } = useSelector<reducerType, {action: ReasonType}>(state => {
        return {
            action: state.event.action
        }
    })
    const [ playLoader, setPlayLoader]= useState<boolean>(false)
       const defaults: AxiosResponse<{
         default: {
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
       }> = useQueryCache().getQueryData("defaults");
       const record: AxiosResponse<{
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
       }> = useQueryCache().getQueryData("records");
    
  const callFlutter = useFlutterwave({
    ...config,
    amount: fundTp,
    customer: {
      email: record?.data.player.email,
      phonenumber: record?.data.player.phone_number,
      name: record?.data.player.full_name,
    },
  });
  return (
    <div
      className={`game_picker_view ${action !== ReasonType.non ? "open" : ""}`}
      onClick={(e: any) => {
        if (!e.target?.classList?.contains("game_picker_view")) {
          return;
        }
        setAction(dispatch,ReasonType.non);
      }}
    >
      {action !== ReasonType.non && (
        <div className="container_price">
          <h3 className="title">Troisplay E wallet form.</h3>
          <p className="txt">
            {fundTp > (record?.data?.cashwallet.currentCash ?? 0) &&
              action === ReasonType.withdraw &&
              `Can't withdraw more than your avalible balance`}
          </p>
          <div className="inputBox">
            <label htmlFor="number">Account</label>
            <input
              type="number"
              value={fundTp}
              onChange={(e) => {
                e.persist();
                setFund(parseInt(e.target.value, 10));
              }}
              id="funds"
              placeholder="in ($)"
            />
          </div>
          <span
            className="btn"
            onClick={async () => {
              if (action === ReasonType.fund) {
                callFlutter({
                  callback: (response) => {
                    console.log(response);
                  },
                  onClose: () => {
                    setFund(0);
                    setAction(dispatch,ReasonType.non);
                  },
                });
              } else {
                return;
              }
            }}
          >
            {playLoader ? (
              <SyncLoader size="10px" color="white" />
            ) : action === ReasonType.withdraw ? (
              "Withdraw"
            ) : action === ReasonType.fund ? (
              "Fund"
            ) : (
              ""
            )}
          </span>
        </div>
      )}
    </div>
  );
}
