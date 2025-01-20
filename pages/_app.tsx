import MessageDisplay from "@/components/MessageDisplay";
import { MessageProvider } from "@/context/NotificationContext";
import { store } from "@/store/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MessageProvider>
        <MessageDisplay />
        <Component {...pageProps} />
      </MessageProvider>
    </Provider>
  );
}
