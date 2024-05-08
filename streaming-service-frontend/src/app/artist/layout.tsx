// src/app/layout.tsx
"use client";
import React, { ReactNode, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../../utils/redux/store";
import { closeModal } from "../../utils/redux/features/modal/modalSlice";

import ArtistSidebar from "@/components/App/sidebar/artistSidebar";
import SPlayer from "@/components/views/dashboard/footer-player";
import { useRouter } from "next/navigation";
import "../globals.css";
import { ApolloWrapper } from "../ApolloWrapper";
import { AddPlaylistModal } from "@/components/App/playlist/AddPlaylistModal";

interface LayoutProps {
  children: ReactNode;
}

const InnerLayout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedIn } = useSelector((state: RootState) => state.user);
  const { isOpen, modalType } = useSelector((state: RootState) => state.modal);
  const userType = useSelector((state: RootState) => state.user.userType);
  if (userType !== "artist") {
    if (userType === "user") {
      router.push("/sound");
    } else {
      router.push("/login");
    }
  }
  useEffect(() => {
    if (!loggedIn) {
      console.log("not logged in:", loggedIn);
      router.push("/login");
    }
    if (userType !== "artist") {
      if (userType === "user") {
        router.push("/sound");
      } else {
        router.push("/login");
      }
    }
  }, [loggedIn, router]);

  const handleCloseModal = () => dispatch(closeModal());

  if (!loggedIn || !userType || userType !== "artist") {
    return null;
  }

  return (
    <ApolloWrapper>
      <div className="flex flex-col h-screen items-start justify-start">
        <div className="flex flex-row h-full w-full">
          <div className="w-fit h-full block top-0 left-0 z-50">
            <ArtistSidebar />
          </div>
          <main className="flex-grow h-full w-full flex items-start justify-start z-50 py-2 pr-2">
            {children}
            <SPlayer />
          </main>
        </div>
      </div>
      {modalType === "AddPlaylistModal" && (
        <AddPlaylistModal isOpen={isOpen} onClose={handleCloseModal} />
      )}
    </ApolloWrapper>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Provider store={store}>
    <InnerLayout>{children}</InnerLayout>
  </Provider>
);

export default Layout;
