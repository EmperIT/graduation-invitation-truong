"use client";

import NewInvitationLayout from "./NewInvitationLayout";
import FloatingActionButton from "./FloatingActionButton";

export default function PageWithIntro({ dearName }: { dearName?: string }) {
    return (
        <div className="relative min-h-[100dvh] overflow-hidden w-full">
            <NewInvitationLayout dearName={dearName} />
            <FloatingActionButton
                phoneNumber="0334053171"
                mapUrl=""
                liveLocationUrl=""
            />
        </div>
    );
}
